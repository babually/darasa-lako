import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
	...defaultStatements,
	resources: ["create", "share", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
	resources: ["create", "update", "delete", "share"],
	...adminAc.statements,
});

export const teacher = ac.newRole({
	resources: ["create", "update", "share"],
});

export const student = ac.newRole({
	resources: ["create", "update", "delete", "share"],
});

export const user = ac.newRole({
	resources: ["create", "update", "delete", "share"],
});

// export const role = {
//     ac,
//     admin,
//     teacher,
//     student,
//     user
// };

// export type Role = keyof typeof role;
