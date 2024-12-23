"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

type Project = {
  name: string;
  key: string;
  description?: string;
};

// For Creating New Project

export async function createProject(data: Project) {
  const { userId, orgId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized!");
  }

  if (!orgId) {
    throw new Error("No Organization Selected!");
  }

  // Fetch organization membership list
  const membershipResponse = (
    await clerkClient()
  ).organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });

  // Extract the actual membership data
  const memberships = (await membershipResponse).data;

  if (!memberships) {
    throw new Error("No members found in the organization!");
  }

  // Check if the user is a member of the organization
  const userMembership = memberships.find(
    (member: any) => member.publicUserData?.userId === userId
  );

  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("Only Organization Admin Can Create Projects");
  }

  try {
    const project = await db.project.create({
      data: {
        name: data.name,
        key: data.key,
        description: data.description,
        organizationId: orgId,
      },
    });

    return project;
  } catch (error: any) {
    throw new Error("Error While Creating A Project " + error.message);
  }
}

// For Getting All The Projects From The Database

export async function getProjects(orgId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized!");
  }

  // Check if the user exists in the database
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found in the database!");
  }

  const projects = await db.project.findMany({
    where: {
      organizationId: orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects;
}

// For Deleting A Specific Project

export async function deleteProject(projectId: string) {
  console.log("yes", projectId);
  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized!");
  }

  if (orgRole !== "org:admin") {
    throw new Error("Only Organization Admins Can Delete The Project");
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error(
      "Project Not Found Or You don't Have Permission For Deleting The Project"
    );
  }

  await db.project.delete({
    where: {
      id: projectId,
    },
  });

  return { success: true };
}

// For Getting Specific Project Form The Database
export async function getProject(projectId: string) {
  const { userId, orgId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized!");
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      Sprint: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    notFound();
    throw new Error("Project Not Found");
  }

  // Verifying The Project Is Belongs To Organization Or Not?
  if (project.organizationId !== orgId) {
    return null;
  }

  return project;
}
