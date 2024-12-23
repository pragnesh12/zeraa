import { getProject } from "@/actions/projects";
import { notFound } from "next/navigation";
import React from "react";
import SprintCreationForm from "../_components/SprintCreationForm";
import SprintBoard from "../_components/SprintBoard";

const Page = async ({ params }: any) => {
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto">
      {/* Sprint Creation Section */}
      <SprintCreationForm
        projectTitle={project.name}
        projectId={projectId}
        projectKey={project.key}
        sprintKey={project.Sprint?.length + 1}
      />
      {/* Sprint Board */}
      {project.Sprint.length > 0 ? (
        <SprintBoard
          sprints={project.Sprint}
          projectId={projectId}
          orgId={project.organizationId}
        />
      ) : (
        <div className="text-xl text-gray-300 mx-8">
          Create A New Sprint From Clicking Above Button
        </div>
      )}
    </div>
  );
};

export default Page;
