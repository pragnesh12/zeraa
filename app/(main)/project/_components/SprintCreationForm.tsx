"use client";

import { createSprint } from "@/actions/sprints";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { addDays, format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Calendar1Icon } from "lucide-react";
import { Chevron, DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { sprintSchema } from "@/app/lib/validators";

const SprintCreationForm = ({
  projectTitle,
  projectId,
  projectKey,
  sprintKey,
}: any) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const router = useRouter();

  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 14),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    control,
  } = useForm({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      startDate: dateRange.from,
      endDate: dateRange.to,
    },
  });

  // console.log("Errors:", errors);
  // console.log("Is Submitting:", isSubmitting);

  const { loading: sprintLoading, func: createSprintFunc } =
    useFetch(createSprint);

  const onSubmit = async (data: any) => {
    try {
      await createSprintFunc(projectId, {
        ...data,
        startDate: dateRange.from,
        endDate: dateRange.to,
      });
      setShowForm(false);
      toast.success("Sprint Created Successfully");
      router.refresh();
    } catch (error) {
      console.error("Error creating sprint:", error);
      toast.error("Failed to create sprint");
    }
  };

  return (
    <>
      <div className="flex justify-between mx-8">
        <h1 className="md:text-4xl text-3xl font-bold gradient-title mb-[2.5rem] md:mt-0 sm:mt-[-1.5rem]">
          {projectTitle}
        </h1>
        <Button
          className="mt-2"
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "destructive" : "default"}
        >
          {showForm ? "Cancel" : "Create New Sprint"}
        </Button>
      </div>

      {showForm && (
        <>
          <Card className="pt-4 mb-4 md:mx-8">
            <CardContent>
              <form
                className="flex gap-4 items-end"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex-1">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1" 
                  >
                    Sprint Name
                  </label>
                  <Input
                    id="name"
                    readOnly
                    className="bg-slate-950"
                    {...register("name")}
                  />
                  {errors?.name && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors?.name?.message}
                    </p>
                  )}
                </div>

                {/* Day Picker */}

                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Sprint Duration
                  </label>

                  <Controller
                    control={control}
                    name="startDate"
                    render={({ field }) => {
                      return (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal bg-slate-950 ${
                                !dateRange && "text-muted-foreground"
                              }`}
                            >
                              <Calendar1Icon className="mr-2 h-4 w-4" />
                              {dateRange.from && dateRange.to ? (
                                format(dateRange.from, "LLL dd, y") +
                                " - " +
                                format(dateRange.to, "LLL dd, y")
                              ) : (
                                <span>Pick A Date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto bg-slate-950 "
                            align="start"
                          >
                            <DayPicker
                              mode="range"
                              selected={dateRange}
                              onSelect={(range: any) => {
                                if (range?.from && range?.to) {
                                  setDateRange(range);
                                  field.onChange(range.from);
                                }
                              }}
                              classNames={{
                                chevron: "fill-purple-500",
                                range_start: "bg-gray-700",
                                range_middle: "bg-gray-800",
                                day_button: "border-none",
                                today: "border-2 border-blue-700",
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      );
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  onClick={() => {
                    console.log("Button clicked");
                  }}
                >
                  {isLoading ? "Creating..." : "Create Sprint"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};

export default SprintCreationForm;
