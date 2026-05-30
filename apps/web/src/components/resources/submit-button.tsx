"use client";

import { Plus } from "lucide-react";
import { Button } from "@darasa-lako/ui/components/button";
import { useResources } from "@/app/store/resource-state";

export function SubmitButton() {
  const { setActiveResourceEditId } = useResources();

  return (
    <Button
      onClick={() => setActiveResourceEditId("new")}
      className="fixed bottom-6 right-6 rounded-full px-5 py-6 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      <Plus className="w-5 h-5 mr-2" />
      Submit Material
    </Button>
  )
}