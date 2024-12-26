"use client";
import {
  format,
  formatDistance,
  formatDistanceToNow,
  isAfter,
  isBefore,
} from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useFetch from "@/hooks/useFetch";
import { updateSprintStatus } from "@/actions/sprints";
import { toast } from "sonner";

const SprintManager = ({
  currentSprint,
  setCurrentSprint,
  sprints,
  projectId,
}: any) => {
  const [status, setStatus] = useState(currentSprint.status);

  const startDate = new Date(currentSprint.startDate);
  const endDate = new Date(currentSprint.endDate);
  const now = new Date();

  const canStart =
    isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";

  const canEnd = status === "ACTIVE";

  const {
    func: updateStatus,
    loading,
    error,
    data: updatedStatus,
  } = useFetch(updateSprintStatus);

  const handleStatusChange = async (newStatus: string) => {
    const isUpdated = await updateStatus(currentSprint.id, newStatus);
    console.log("Isupdated : ", isUpdated);
  };

  useEffect(() => {
    // @ts-ignore
    if (updatedStatus && updatedStatus?.success) {
      // @ts-ignore
      setStatus(updatedStatus?.sprint.status);
      setCurrentSprint({
        ...currentSprint,
        // @ts-ignore
        status: updatedStatus.sprint.status,
      });
    }
  }, [updatedStatus, loading]);

  const handleSprintChange = (value: any) => {
    const selectedSprint = sprints.find((s: any) => s.name === value);
    setCurrentSprint(selectedSprint);
    setStatus(selectedSprint?.status);
  };

  const getStatusText = () => {
    if (status === "COMPLETED") {
      return `Sprint Ended`;
    }
    if (status === "ACTIVE" && isAfter(now, endDate)) {
      return `Overdue By ${formatDistanceToNow(endDate)}`;
    }
    if (status === "PLANNED" && isBefore(now, startDate)) {
      return `Starts In ${formatDistanceToNow(startDate)}`;
    }

    return null;
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 mx-4 md:mx-8">
        {/* Select Dropdown */}
        <Select value={currentSprint?.name} onValueChange={handleSprintChange}>
          <SelectTrigger className="bg-slate-950  md:py-4">
            <SelectValue placeholder={"Please Select The Sprint"} />
          </SelectTrigger>
          <SelectContent>
            {sprints.map((sprint: any) => (
              <SelectItem
                key={sprint.id}
                value={sprint.name}
                className="py-2 px-3 md:p-3"
              >
                {sprint.name} ({format(sprint.startDate, "MMM d, yyyy")}) to{" "}
                {format(sprint.endDate, "MMM d, yyyy")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Start Sprint Button */}
        {canStart && (
          <Button
            className="bg-green-800 text-white py-3 px-5 md:py-5 md:px-6"
            onClick={() => {
              handleStatusChange("ACTIVE");
            }}
            disabled={loading}
          >
            Start Sprint
          </Button>
        )}

        {/* End Sprint Button */}
        {canEnd && (
          <Button
            variant={"destructive"}
            onClick={() => {
              handleStatusChange("COMPLETED");
            }}
            disabled={loading}
            className="py-3 px-5 md:py-5 md:px-6"
          >
            End Sprint
          </Button>
        )}
      </div>

      <div className="ml-4 md:ml-8 mt-3">
        {getStatusText() && (
          <Badge className="text-xs md:text-sm px-2 py-1 md:px-3 md:py-2">
            {getStatusText()}
          </Badge>
        )}
      </div>
    </>
  );
};

export default SprintManager;
