"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// For Creating The Issue
export async function createIssue(projectId: string, data: any) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      throw new Error("Unauthorized! Please login to proceed.");
    }

    // Check if required fields are present in the data
    const { title, description, status, priority, sprintId, assigneeId } = data;
    if (!title || !description || !status || !priority) {
      throw new Error(
        "Missing required fields: title, description, status, or priority."
      );
    }

    let user = await db.user.findUnique({ where: { clerkUserId: userId } });

    if (!user) {
      throw new Error("User not found in the database.");
    }

    const lastIssue = await db.Issue.findFirst({
      where: { projectId, status: status },
      orderBy: { order: "desc" },
    });

    const newOrder = lastIssue ? lastIssue.order + 1 : 0;
    console.log("lastIssue", lastIssue);
    console.log("newOrder", newOrder);

    const issue = await db.Issue.create({
      data: {
        title,
        description,
        status,
        priority,
        projectId,
        sprintId,
        reporterId: user.id,
        assigneId: assigneeId || null,
        order: newOrder,
      },
      include: {
        assignee: true,
        reporter: true,
      },
    });

    return issue;
  } catch (error: any) {
    // Log the error (you could also log to an external service)
    console.error("Error creating issue:", error);

    // Return a custom error message to the client
    throw new Error(
      `Failed to create issue: ${error.message || "Unknown error"}`
    );
  }
}

// For Getting Sprint Issues
export async function getIssueForSprint(data: any) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      throw new Error("Unauthorized! Please login to proceed.");
    }

    const issues = await db.Issue.findMany({
      where: {
        sprintId: data.id,
      },
      orderBy: [{ status: "asc" }, { order: "desc" }],
      include: {
        assignee: true, // Corrected the typo here
        reporter: true,
      },
    });

    return issues;
  } catch (error: any) {
    // Log the error (you could also log to an external service)
    console.error("Error While Finding Issues:", error);

    // Return a custom error message to the client
    throw new Error(
      `Failed to retrieve issues: ${error.message || "Unknown error"}`
    );
  }
}

// For Updating Issues Status
export async function updateIssueStatus(updateIssues: any) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized!");
  }

  // Check if the user exists in the database
  const user = await db.$transaction(async (prisma: any) => {
    for (const issue of updateIssues) {
      await prisma.Issue.update({
        where: {
          id: issue.id,
        },
        data: {
          status: issue.status,
          order: issue.order,
        },
      });
    }
  });

  return { success: true };
}

// For Deleting Issue
export async function deleteIssue(issueId: any) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
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

  const issue = await db.Issue.findUnique({
    where: {
      id: issueId,
    },
    include: {
      project: true,
    },
  });

  if (!issue) {
    throw new Error("Issue not found!");
  }

  // if (issue.reporterId !== userId && !issue.project.adminIds.includes(userId)) {
  //   throw new Error("You Don't Have Permission To Delete This Issue");
  // }

  await db.Issue.delete({ where: { id: issueId } });

  return { success: true };
}

// For Updating Issues
export async function updateIssue(issueId: any, data: any) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized!");
  }

  try {
    const issue = await db.Issue.findUnique({
      where: {
        id: issueId,
      },
      include: {
        project: true,
      },
    });

    if (!issue) {
      throw new Error("Issue not found!");
    }

    const updatedIssue = await db.Issue.update({
      where: {
        id: issueId,
      },
      data: {
        status: data.status,
        priority: data.priority,
      },
      include: {
        assignee: true,
        reporter: true,
      },
    });
    console.log(updateIssue);

    return updateIssue;
  } catch (error: any) {
    throw new Error("Error while updating issue : " + error?.message);
  }
}

// For getting issues
export async function getUserIssues(userId: string) {
  const { orgId } = await auth();

  if (!userId || !orgId) {
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

  const issues = await db.Issue.findMany({
    where: {
      OR: [{ assigneId: user.id }, { reporterId: user.id }],
      project: {
        organizationId: orgId,
      },
    },
    include: {
      project: true,
      assignee: true,
      reporter: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return issues;
}
