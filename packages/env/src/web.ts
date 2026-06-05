import { createEnv } from "@t3-oss/env-nextjs";
// import { z } from "zod";

export const env = createEnv({
	client: {},
	runtimeEnv: {},
	// client: {
	// 	NEXT_PUBLIC_BYTESHIP_API_KEY: z.url(),
	// },
	// runtimeEnv: {
	// 	NEXT_PUBLIC_BYTESHIP_API_KEY: process.env.NEXT_PUBLIC_BYTESHIP_API_KEY,
	// },
	emptyStringAsUndefined: true,
});
