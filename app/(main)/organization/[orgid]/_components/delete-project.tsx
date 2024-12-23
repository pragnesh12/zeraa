"use client";

import { deleteProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { useOrganization } from "@clerk/nextjs";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const DeleteProject = ({ projectId }: any) => {
  // Custom Hook Implemention :
  const {
    data: deleted,
    error,
    setData,
    loading: isDeleting,
    func: deleteProjectFunc,
  } = useFetch(deleteProject);

  useEffect(() => {
    // @ts-ignore
    if (deleted?.success) {
      toast.success("Project Deleted Successfully");
      router.refresh();
    }
  }, [deleted]);

  const { membership } = useOrganization();
  const router = useRouter();
  const isAdmin = membership?.role === "org:admin";
  if (!isAdmin) return null;

  const handleDeleteClick = async () => {
    if (window.confirm("Are You Sure Want To Delete This Project?")) {
      deleteProjectFunc(projectId);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size={"sm"}
        onClick={handleDeleteClick}
        disabled={isDeleting}
        className={`${isDeleting ? "animate-pulse" : ""}`}
      >
        <Trash2Icon className="h-4 w-4" />
      </Button>
      {/*  @ts-ignore */}
      {/* {error && <p className="text-red-500 text-sm">{error.message}</p>} */}
    </>
  );
};

export default DeleteProject;
