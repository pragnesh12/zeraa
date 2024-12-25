import { getOrganization } from "@/actions/organization";
import OrgSwitcher from "@/components/org-switcher";
import React from "react";
import ProjectList from "./_components/project-list";
import UserIssues from "./_components/user-issues";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Params = Promise<{ orgid: string }>;

const Organization = async ({ params }: { params: Params }) => {
  const { orgid } = await params;
  const { userId } = await auth();

  console.log("orgId ===> ", orgid);

  if (!userId) {
    redirect("/sign-in");
  }

  const organization = await getOrganization(orgid);

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="mx-8">
        <div className="flex flex-col sm:flex-row justify-between items-start">
          <h1 className="text-5xl font-bold gradient-title pb-6">
            {organization.membership.organization.name}'s Projects
          </h1>

          {/* Organization Switcher Dropper Button */}
          <OrgSwitcher />
        </div>
        <div className="mb-5 mt-6">
          <ProjectList orgId={organization.membership.organization.id} />
        </div>
        <div className="mt-10">
          <UserIssues userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default Organization;
