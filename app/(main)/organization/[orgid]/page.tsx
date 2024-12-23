import { getOrganization } from "@/actions/organization";
import OrgSwitcher from "@/components/org-switcher";
import React from "react";
import ProjectList from "./_components/project-list";
import UserIssues from "./_components/user-issues";
import { auth } from "@clerk/nextjs/server";

type Params = {
  params: {
    orgid: string;
  };
};

const Organization = async ({ params }: Params) => {
  const organization = await getOrganization(params.orgid);
  if (!organization) {
    return <div>Organization Not Found!</div>;
  }

  const { userId } = await auth();
  return (
    <div className="container mx-auto ">
      <div className="mx-8">
        <div className="flex flex-col sm:flex-row justify-between items-start ">
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
