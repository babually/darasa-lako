import { auth } from "@darasa-lako/auth";
import prisma from "@darasa-lako/db";
import z from "zod";
import { applyPush } from "@darasa-lako/db/idb/server/batch-processor";
import { outboxEventSchema } from "@darasa-lako/db/idb/validators";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  // Parse and validate request body
  let pushRequestBody: unknown;
  try {
    pushRequestBody = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Malformed JSON" }), { status: 400 });
  }

  const parsed = z.object({ events: z.array(outboxEventSchema) }).safeParse(pushRequestBody);

  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid request", details: parsed.error }), {
      status: 400,
    });
  }

  // Authenticate the request
  const authResult = await auth.api.getSession({ headers: request.headers });
  if (!authResult?.user.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  // Apply the mutations
  try {
    const pushResults = await applyPush({
      events: parsed.data.events,
      scopeKey: authResult.user.id,
      prisma,
    });
    return new Response(JSON.stringify(pushResults), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.startsWith("Batch size") ? 413 : 500;
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}