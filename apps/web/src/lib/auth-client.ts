import {
	ac,
	admin,
	student,
	teacher,
	user,
} from "@darasa-lako/auth/permissions";
import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3050",
	plugins: [
		adminClient({
			ac,
			roles: {
				admin,
				teacher,
				student,
				user,
			},
		}),
	],
});
