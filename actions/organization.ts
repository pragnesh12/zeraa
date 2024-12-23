"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getOrganization(slug: string) {
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

  // Fetch organization details by slug
  const organization = (await clerkClient()).organizations.getOrganization({
    slug,
  });

  if (!organization) {
    throw new Error(`Organization with slug "${slug}" not found!`);
    return null;
  }

  // Fetch organization membership list
  const membershipResponse = (
    await clerkClient()
  ).organizations.getOrganizationMembershipList({
    organizationId: (await organization).id,
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

  if (!userMembership) {
    throw new Error("User is not a member of this organization!");
    return null;
  }

  // Return the organization details and user membership
  return {
    organization,
    membership: userMembership,
  };
}

// Fetch all organization users
export async function getOrganizationUsers(orgId: string) {
  try {
    // Get authenticated user ID
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized! User is not authenticated.");
    }

    console.log("userId", userId);
    // Check if the user exists in the database
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found in the database!");
    }

    // Fetch organization membership list
    const membershipResponse = (
      await clerkClient()
    ).organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

    // Extract user IDs
    const userIds = (await membershipResponse).data.map((membership: any) => {
      return membership.publicUserData?.userId;
    });

    // Fetch users from your database
    const users = await db.user.findMany({
      where: {
        clerkUserId: {
          in: userIds,
        },
      },
    });

    return users;
  } catch (error) {
    console.error("Error fetching organization users: ", error);
    throw error;
  }
}
