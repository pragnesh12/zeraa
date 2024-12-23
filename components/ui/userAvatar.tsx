import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AvatarUrl = {
  user: {
    imageUrl: string;
    name: string;
  };
};

const UserAvatar = ({ user }: any) => {
  return (
    <div className="flex items-center space-x-2 w-full">
      <Avatar className="h-6 w-6">
        <AvatarImage src={user?.imageUrl} alt={user?.name} />
        <AvatarFallback className="capitalize">
          {user ? user?.name : "?"}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm text-gray-600">
        {user ? user?.name : "Unassigned"}
      </span>
    </div>
  );
};

export default UserAvatar;
