import { getProjects } from "@/actions/projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import DeleteProject from "./delete-project";

export default async function ProjectList({ orgId }: any) {
  const projects = await getProjects(orgId);
  if (projects.length === 0) {
    return (
      <p>
        No Projects Found.{" "}
        <Link
          href="/project/create"
          className="underline underline-offset-2 text-purple-200"
        >
          Create New
        </Link>
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project: any) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {project.name}
              <DeleteProject projectId={project.id} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-300 mb-3">{project.description}</p>
            <Link
              href={`/project/${project.id}`}
              className="text-blue-400 hover:underline mt-1"
            >
              View Project
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
