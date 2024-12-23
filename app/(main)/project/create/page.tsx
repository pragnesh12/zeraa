"use client";

import OrgSwitcher from "@/components/org-switcher";
import { useOrganization, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "@/app/lib/validators";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createProject } from "@/actions/projects";

type Props = {};

const Page = (props: Props) => {
  const { isLoaded: isOrgLoaded, membership } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);

  type FormInput = z.infer<typeof projectSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<FormInput>({
    resolver: zodResolver(projectSchema),
  });

  // Custom Hook Implemention :
  const {
    data: project,
    error,
    setData,
    loading,
    func: createProjectFunc,
  } = useFetch(createProject);

  useEffect(() => {
    if (isOrgLoaded && isUserLoaded && membership) {
      setIsAdmin(membership.role === "org:admin");
    }
  }, [isOrgLoaded, isUserLoaded, membership]);

  useEffect(() => {
    if (project) {
      toast.success("Project Created Successfully");
      // @ts-ignore
      router.push(`/project/${project.id}`);
    }
  }, [loading]);

  if (!isOrgLoaded || !isUserLoaded) {
    return null;
  }

  if (!isAdmin) {
    return (
      <>
        <div className="flex flex-col gap-2 items-center">
          <span className="text-3xl gradient-title pb-3">
            Oops! Only Admins Can Create Projects
          </span>
          <OrgSwitcher />
        </div>
      </>
    );
  }

  // Handle Submit Button :
  const onSubmit = async (data: any) => {
    createProjectFunc(data);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="md:text-5xl text-3xl text-center gradient-title font-bold mb-9">
        Create New Project
      </h1>
      <form
        className="mx-10 flex flex-col space-y-5 bg-transparent"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <Input
            id="name"
            placeholder="Enter The Project Name"
            className="bg-slate-950 text-gray-200 text-md py-6"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Input
            id="key"
            placeholder="Enter Project key (Ex: RPVT)"
            className="bg-slate-950 text-gray-200 text-md py-6"
            {...register("key")}
          />
          {errors.key && (
            <p className="text-red-500 text-sm mt-1">{errors.key.message}</p>
          )}
        </div>
        <div>
          <Textarea
            id="description"
            placeholder="Enter The Project Description"
            className="bg-slate-950 text-gray-200 text-md h-[10rem] py-3"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex flex-row gap-1 items-center mx-auto space-x-4 mt-5">
          <Button
            className="bg-purple-600 hover:bg-purple-500 text-gray-200 md:text-md text-sm"
            size={"lg"}
            disabled={loading}
            type="submit"
          >
            {loading ? "Creating..." : "Create Project"}
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-500 text-gray-200 md:text-md text-sm"
            size={"lg"}
            type="reset"
          >
            Reset
          </Button>
          {error && (
            // @ts-ignore
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Page;
