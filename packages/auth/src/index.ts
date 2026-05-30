import { expo } from "@better-auth/expo";
import { createPrismaClient } from "@darasa-lako/db";
import { env } from "@darasa-lako/env/server";
import { betterAuth } from "better-auth";
import { admin as adminPlugin } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { ac, admin, teacher, student, user } from "./permissions"

export function createAuth() {
  const prisma = createPrismaClient();

  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),

    trustedOrigins: [
      env.CORS_ORIGIN,
      "darasa-lako://",
      ...(env.NODE_ENV === "development"
        ? ["exp://", "exp://**", "exp://192.168.*.*:*/**", "http://localhost:8081"]
        : []),
    ],
    emailAndPassword: {
      enabled: true,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL || "http://localhost:3050",
    plugins: [
      nextCookies(),
      expo(),
      adminPlugin({
        ac,
        roles: {
          admin,
          teacher,
          student,
          user,
        }
      }),
    ],
  });
}

export const auth = createAuth();
