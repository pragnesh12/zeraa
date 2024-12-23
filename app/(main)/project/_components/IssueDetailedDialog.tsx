import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import statuses from "@/data/status.json";
import MDEditor, { issue } from "@uiw/react-md-editor";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { deleteIssue, updateIssue } from "@/actions/issues";
import useFetch from "@/hooks/useFetch";
import { BarLoader, PulseLoader } from "react-spinners";
import UserAvatar from "@/components/ui/userAvatar";

const IssueDetailedDialog = ({
  isOpen,
  onUpdate = () => {},
  onDelete = () => {},
  borderColor = "",
  onClose,
  issue,
}: any) => {
  const [status, setStatus] = useState(issue.status);
  const [priority, setPriority] = useState(issue.priority);

  const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];

  const { user } = useUser();
  const { membership } = useOrganization();

  const pathName = usePathname();
  const isProjectPage = pathName.startsWith("/project/");
  const router = useRouter();

  const {
    loading: updateIssueLoading,
    error: updationError,
    func: updateIssueFn,
    data: updated,
  } = useFetch(updateIssue);

  const {
    loading: deleteIssueLoading,
    error: deleteError,
    func: deleteIssueFn,
    data: deleted,
  } = useFetch(deleteIssue);

  const canChange =
    user?.id === issue.reporter.clerkUserId || membership?.role === "org:admin";

  const handleGoToProject = () => {
    router.push(`/project/${issue.projectId}?sprint=${issue.sprintId}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are You Sure Want To Delete This Issue?")) {
      await deleteIssueFn(issue.id);
    }
  };

  useEffect(() => {
    if (deleted) {
      onClose();
      onDelete();
    }

    if (updated) {
      onUpdate(updated);
    }
  }, [deleted, updated, deleteIssueLoading, updateIssueLoading]);

  const handleStatusChange = async (newStatus: any) => {
    setStatus(newStatus);
    await updateIssueFn(issue.id, { status: newStatus, priority });
  };

  const handlePriorityChange = async (newPriority: any) => {
    setPriority(newPriority);
    await updateIssueFn(issue.id, { priority: newPriority, status });
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-between  items-center">
              <DialogTitle className="text-3xl">{issue?.title}</DialogTitle>
            </div>
            {!isProjectPage && (
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={handleGoToProject}
                title="Go To Project"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </DialogHeader>

          {(updateIssueLoading || deleteIssueLoading) && (
            <BarLoader
              color="#6e39ae"
              width={"100%"}
              className="text-center mt-4"
            />
          )}

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((op) => (
                    <SelectItem key={op.key} value={op.key}>
                      {op.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={priority}
                onValueChange={handlePriorityChange}
                disabled={!canChange}
              >
                <SelectTrigger className={`border ${borderColor} rounded`}>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((op) => (
                    <SelectItem key={op} value={op}>
                      {op}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Description</h4>
            <MDEditor.Markdown
              className="rounded-lg px-2 py-1 bg-gray-100"
              source={issue.description ? issue.description : "--"}
            />
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Assignee</h4>
              <UserAvatar user={issue.assignee} />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Reporter</h4>
              <UserAvatar user={issue.reporter} />
            </div>

            {canChange && (
              <Button
                onClick={handleDelete}
                disabled={deleteIssueLoading}
                variant="destructive"
              >
                {deleteIssueLoading ? "deleting..." : "Delete Issue"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IssueDetailedDialog;
