"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

// For Creating New Sprint
export async function createSprint(
  projectId: string,
  data: { name: string; startDate: Date; endDate: Date }
) {
  // Authenticate the user
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error(
      "Unauthorized: You must be signed in to perform this action."
    );
  }

  // Check if the project exists
  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    console.error("Project not found for ID:", projectId);
    notFound();
  }

  // Verify the project belongs to the user's organization
  if (project.organizationId !== orgId) {
    console.error(
      `Unauthorized access: Project ID ${projectId} does not belong to Org ID ${orgId}`
    );
    throw new Error("You are not authorized to access this project.");
  }

  try {
    // Create the sprint
    const sprint = await db.Sprint.create({
      data: {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        status: "PLANNED", // Enum value
        projectId,
      },
    });

    console.log("Sprint created successfully:", sprint);
    return sprint;
  } catch (error) {
    console.error("Error creating sprint:", error);
    throw new Error("Failed to create sprint. Please try again later.");
  }
}

// For Updating The Status Of The Task Or Sprint
export async function updateSprintStatus(sprintId: string, newStatus: string) {
  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) {
    throw new Error(
      "Unauthorized: You must be signed in to perform this action."
    );
  }

  try {
    const sprint = await db.Sprint.findUnique({
      where: {
        id: sprintId,
      },
      include: {
        project: true,
      },
    });

    if (!sprint) {
      throw new Error("Sorry! Sprint Not Founded.");
    }

    if (sprint.project.organizationId !== orgId) {
      throw new Error(
        "Unauthorized: Organization Id Is Not Valid Please Contact Owner Of This Application"
      );
    }

    if (orgRole !== "org:admin") {
      throw new Error("Sorry! Only Admin's Can Make Changes.");
    }

    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const now = new Date();

    if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
      throw new Error("Can Not Start Sprint Outside Of Its Date Range");
    }
    if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
      throw new Error("Can Only Complete An Active Sprint");
    }

    const updateSprint = await db.Sprint.update({
      where: {
        id: sprintId,
      },
      data: {
        status: newStatus,
      },
    });

    return { success: true, sprint: updateSprint };
  } catch (error) {
    console.error("Error updating the sprint:", error);
    throw new Error("Failed to updating the sprint. Please try again later.");
  }
}
