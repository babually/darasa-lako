import { auth } from "@darasa-lako/auth";
import prisma from "@darasa-lako/db";
import { pullAndMaterializeLogs } from "@darasa-lako/db/idb/server/batch-processor";
import z from "zod";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
	// Parse and validate request body
	let pullRequestBody: unknown;
	try {
		pullRequestBody = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: "Malformed JSON" }), {
			status: 400,
		});
	}

	const parsed = z
		.object({ lastChangelogId: z.uuidv7().optional() })
		.safeParse(pullRequestBody);

	if (!parsed.success) {
		return new Response(
			JSON.stringify({ error: "Invalid request", details: parsed.error }),
			{
				status: 400,
			},
		);
	}

	// Authenticate the request
	let authResult: Awaited<ReturnType<typeof auth.api.getSession>> | null = null;
	try {
		authResult = await auth.api.getSession({ headers: request.headers });
	} catch {
		return new Response(JSON.stringify({ error: "Authentication failed" }), {
			status: 401,
		});
	}

	if (!authResult?.user.id) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
		});
	}

	// Fetch and materialize changes with error handling
	try {
		const logsWithRecords = await pullAndMaterializeLogs({
			prisma,
			scopeKey: authResult.user.id,
			lastChangelogId: parsed.data.lastChangelogId,
		});

		return new Response(
			JSON.stringify({
				cursor:
					logsWithRecords.at(-1)?.id ?? parsed.data.lastChangelogId ?? null,
				logsWithRecords,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (error) {
		console.error("Error in pullAndMaterializeLogs:", error);
		return new Response(
			JSON.stringify({
				error: "Failed to process logs",
				details: error instanceof Error ? error.message : "Unknown error",
			}),
			{ status: 500 },
		);
	}
}

// import { auth } from "@darasa-lako/auth";
// import prisma from "@darasa-lako/db";
// import z from "zod";
// import { pullAndMaterializeLogs } from "@darasa-lako/db/idb/server/batch-processor";

// export async function POST(request: Request): Promise<Response> {
//   // Parse and validate request body
//   let pullRequestBody: unknown;
//   try {
//     pullRequestBody = await request.json();
//   } catch {
//     return new Response(JSON.stringify({ error: "Malformed JSON" }), { status: 400 });
//   }

//   const parsed = z.object({ lastChangelogId: z.uuidv7().optional() }).safeParse(pullRequestBody);

//   if (!parsed.success) {
//     return new Response(JSON.stringify({ error: "Invalid request", details: parsed.error }), {
//       status: 400,
//     });
//   }

//   // Authenticate the request
//   const authResult = await auth.api.getSession({ headers: request.headers });
//   if (!authResult?.user.id) {
//     return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
//   }

//   // Fetch and materialize changes
//   const logsWithRecords = await pullAndMaterializeLogs({
//     prisma,
//     scopeKey: authResult.user.id,
//     lastChangelogId: parsed.data.lastChangelogId,
//   });

//   return new Response(
//     JSON.stringify({
//       cursor: logsWithRecords.at(-1)?.id ?? parsed.data.lastChangelogId ?? null,
//       logsWithRecords,
//     }),
//     {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     }
//   );
// }
