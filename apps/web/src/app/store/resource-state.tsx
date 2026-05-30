"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { getClient, initializeClient } from "@/lib/idb-client";
import { toast } from "sonner";
import type { Prisma } from "@darasa-lako/db/client";
import type { SyncWorker } from "@darasa-lako/db/idb/client/idb-interface";

import { authClient } from "@/lib/auth-client";

type ResourcePayload = Prisma.ResourceGetPayload<{ include: { uploader: true } }>;

interface ResourcesState {
  resources: ResourcePayload[] | undefined;
  syncWorker: SyncWorker | undefined;
  activeResourceEditId: string | undefined;
  setActiveResourceEditId: (id: string | undefined) => void;
  loadResources: () => Promise<void>;
  addResource: (resource: Omit<Prisma.ResourceCreateInput, "uploader">) => Promise<void>;
  updateResource: (resourceId: string, data: Omit<Prisma.ResourceUpdateInput, "uploader">) => Promise<void>;
  deleteResource: (resourceId: string) => Promise<void>;
}

const ResourcesContext = createContext<ResourcesState | undefined>(undefined);

export function ResourcesProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  const [resources, setResources] = useState<ResourcePayload[]>();
  const [syncWorker, setSyncWorker] = useState<SyncWorker>();
  const [activeResourceEditId, setActiveResourceEditId] = useState<string>();
  const [isReady, setIsReady] = useState(false);
  const unsubscribeResource = useRef<(() => void) | undefined>(undefined);

  const getCursor = useCallback(() => {
    if (typeof window === "undefined") throw new Error("Not in browser environment");
    const lastSyncedAt = localStorage.getItem("lastSyncedAt");
    return lastSyncedAt ?? undefined;
  }, []);

  const setCursor = useCallback((cursor: string | undefined) => {
    if (typeof window === "undefined") throw new Error("Not in browser environment");
    if (cursor !== undefined) {
      localStorage.setItem("lastSyncedAt", cursor);
    } else {
      localStorage.removeItem("lastSyncedAt");
    }
  }, []);

  const loadResources = useCallback(async () => {
    try {
      const data = await getClient().resource.findMany({ include: { uploader: true } });
      setResources(data);
    } catch (error) {
      console.error("Error loading resources:", error);
      toast.error("Failed to load resources");
    }
  }, []);

  // Initialize PrismaIDBClient on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      initializeClient().then(() => {
        setIsReady(true);
      }).catch((err) => {
        console.error("Failed to initialize PrismaIDBClient:", err);
      });
    }
  }, []);

  // Sync authenticated user to local IndexedDB to enable resource uploading
  useEffect(() => {
    if (!isReady || !session?.user) return;

    const syncUser = async () => {
      try {
        const dbUser = await getClient().user.findFirst({
          where: { id: session.user.id }
        });
        
        if (!dbUser) {
          await getClient().user.create({
            data: {
              id: session.user.id,
              name: session.user.name,
              email: session.user.email,
              emailVerified: session.user.emailVerified,
              image: session.user.image,
              role: session.user.role || "user",
              createdAt: new Date(session.user.createdAt || Date.now()),
              updatedAt: new Date(session.user.updatedAt || Date.now()),
            }
          });
          console.log("Successfully created user in IndexedDB");
        }
      } catch (err) {
        console.error("Failed to sync auth user to IndexedDB:", err);
      }
    };

    syncUser();
  }, [isReady, session]);

  useEffect(() => {
    if (!isReady) return;

    const worker = getClient().createSyncWorker({
      push: {
        handler: async (events: unknown) => {
          // Note: Changed /api/sync/push to /api/async/push to match your API route paths
          const pushResult = await fetch("/api/async/push", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ events }),
          });
          if (!pushResult.ok) {
            throw new Error(`Push failed with status ${pushResult.status}`);
          }
          return pushResult.json();
        },
        batchSize: 50,
      },
      pull: {
        handler: async (cursor?: string) => {
          // Note: Changed /api/sync/pull to /api/async/pull to match your API route paths
          const pullResult = await fetch("/api/async/pull", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lastChangelogId: cursor?.toString() }),
          });
          if (!pullResult.ok) {
            throw new Error(`Pull failed with status ${pullResult.status}`);
          }
          const pullData = await pullResult.json();

          loadResources();
          return pullData;
        },
        getCursor,
        setCursor,
      },
      schedule: {
        intervalMs: 10000,
        backoffMs: 30000,
      },
    });
    setSyncWorker(worker);

    loadResources();

    // Original code referred to an undefined 'this.boardCallback', replacing with 'loadResources'
    unsubscribeResource.current = getClient().resource.subscribe(["create", "update", "delete"], loadResources);

    return () => {
      unsubscribeResource.current?.();
      setSyncWorker((currentWorker) => {
        currentWorker?.stop?.();
        return undefined;
      });
    };
  }, [isReady, loadResources, getCursor, setCursor]);

  const addResource = useCallback(async (resource: Omit<Prisma.ResourceCreateInput, "uploader">) => {
    try {
      const currentUser = await getClient().user.findFirst();
      if (!currentUser) {
        toast.error("No user found. Please log in.");
        return;
      }
      await getClient().resource.create({ 
        data: { 
          ...resource, 
          uploader: { connect: { id: currentUser.id } } 
        } 
      });
    } catch (error) {
      console.error("Error creating resource:", error);
      toast.error("Failed to create resource");
    }
  }, []);

  const updateResource = useCallback(async (resourceId: string, data: Omit<Prisma.ResourceUpdateInput, "uploader">) => {
    try {
      await getClient().resource.update({
        where: { id: resourceId },
        data: { ...data },
      });
      setActiveResourceEditId(undefined);
    } catch (error) {
      console.error("Error updating resource:", error);
      toast.error("Failed to update resource");
    }
  }, []);

  const deleteResource = useCallback(async (resourceId: string) => {
    try {
      await getClient().resource.delete({ where: { id: resourceId } });
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Failed to delete resource");
    }
  }, []);

  const value = {
    resources,
    syncWorker,
    activeResourceEditId,
    setActiveResourceEditId,
    loadResources,
    addResource,
    updateResource,
    deleteResource,
  };

  return <ResourcesContext.Provider value={value}>{children}</ResourcesContext.Provider>;
}

export function useResources() {
  const context = useContext(ResourcesContext);
  if (context === undefined) {
    throw new Error("useResources must be used within a ResourcesProvider");
  }
  return context;
}
