"use client";
import * as React from "react";
import { useEffect } from "react";
import { getOrganizationUsers } from "@/actions/organization";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { BarLoader } from "react-spinners";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { issueSchema } from "@/app/lib/validators";
import useFetch from "@/hooks/useFetch";
import { createIssue } from "@/actions/issues";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function IssueDrawer({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}: any) {
  // For Fetching All Organization Users
  const {
    loading: usersLoading,
    func: fetchUsers,
    data: fetchedUsers,
  } = useFetch(getOrganizationUsers);

  // Set Loading
  useEffect(() => {
    if (orgId) {
      const yes = fetchUsers(orgId);
    }
  }, [isOpen, orgId]);

  console.log("Fetched Users : ", fetchedUsers);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isLoading },
    reset,
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
      title: "",
    },
  });

  // For Creating Issues
  const {
    loading: issueLoading,
    func: createIssueFunc,
    data: newIssue,
    error,
  } = useFetch(createIssue);

  // Now Submiting
  const onSubmit = async (data: any) => {
    await createIssueFunc(projectId, {
      ...data,
      status,
      sprintId,
    });
  };

  // After Creating An Issue
  useEffect(() => {
    if (newIssue) {
      reset();
      onClose();
      onIssueCreated();
      toast.success("Issue Added Successfully");
    }
  }, [newIssue, issueLoading]);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="">
          <DrawerHeader>
            <DrawerTitle className="text-3xl mx-5">
              Create Your Issue
            </DrawerTitle>
          </DrawerHeader>
          {usersLoading && <BarLoader width={"100%"} color="purple" />}
          <form
            className="mx-8 p-2 space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <Input
                placeholder="Enter Title For The Issue"
                id="title"
                {...register("title")}
              ></Input>
              {errors?.title && (
                <p className="text-red-500 mt-1 text-sm">
                  {/* @ts-ignore */}
                  {errors?.title?.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="assigneeId"
                className="block text-sm font-medium mb-1"
              >
                Assginee
              </label>
              <Controller
                name="assigneeId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Assginee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {fetchedUsers?.map((user: any) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors?.assigneeId && (
                <p className="text-red-500 mt-1 text-sm">
                  {/* @ts-ignore */}
                  {errors?.assigneeId?.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Description
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <MDEditor value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium mb-1"
              >
                Priority
              </label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="LOW">LOW</SelectItem>
                        <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                        <SelectItem value="HIGH">HIGH</SelectItem>
                        <SelectItem value="URGENT">URGENT</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex flex-row gap-1 items-center mx-auto text-center space-x-4 mt-2">
              <Button
                type="submit"
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 md:text-md text-sm w-full  mb-1"
                size={"lg"}
                disabled={issueLoading}
              >
                {issueLoading ? "Creating..." : "Create Issue"}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
