"use server";

import prisma from "@darasa-lako/db";

export async function getDashboardStats() {
  try {
    const [totalMembers, totalNotes, totalExams, totalResourcesFiles] = await Promise.all([
      prisma.user.count(),
      prisma.resource.count({
        where: { type: "notes" }
      }),
      prisma.resource.count({
        where: { type: "exam" }
      }),
      prisma.resource.count({
        where: { type: "resource" }
      })
    ]);

    return {
      totalMembers,
      totalNotes,
      totalExams,
      totalResourcesFiles,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalMembers: 0,
      totalNotes: 0,
      totalExams: 0,
      totalResourcesFiles: 0,
    };
  }
}
