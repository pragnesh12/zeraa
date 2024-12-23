"use client";

import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/ui/userAvatar";
import { formatDistance, formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import IssueDetailedDialog from "./IssueDetailedDialog";

const priorityColor = {
  LOW: "border-green-600",
  MEDIUM: "border-yellow-600",
  HIGH: "border-orange-600",
  URGENT: "border-red-600",
};

const IssueCard = ({
  issue,
  showStatus = false,
  onDelete = () => {},
  onUpdate = () => {},
}: any) => {
  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const onDeleteHandler = (...params: any) => {
    router.refresh();
    onDelete(...params);
  };
  const onUpdateHandler = (...params: any) => {
    router.refresh();
    onDelete(...params);
  };

  return (
    <>
      <Card
        className={`cursor-pointer hover:shadow-md transition-shadow `}
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader
          // @ts-ignore
          className={`border-t-2 ${priorityColor[issue?.priority]} rounded-lg`}
        >
          <CardTitle>{issue.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 -mt-3">
          {showStatus && <Badge>{issue.status}</Badge>}
          <Badge variant={"outline"} className="-ml-1">
            {issue.priority}
          </Badge>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-3">
          <UserAvatar user={issue.assignee} />
          <div className="text-sm text-gray-400 w-full">Created {created}</div>
        </CardFooter>
      </Card>

      {isDialogOpen && (
        <>
          <IssueDetailedDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            issue={issue}
            onDelete={onDeleteHandler}
            onUpdate={onUpdateHandler}
            // @ts-ignore
            borderColor={priorityColor[issue?.priority]}
          />
        </>
      )}
    </>
  );
};

export default IssueCard;
