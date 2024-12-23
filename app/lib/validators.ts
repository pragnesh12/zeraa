import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .min(2, "Project Name Is Required")
    .max(100, "Project Name Must Be 100 Charcters Or Less"),
  key: z
    .string()
    .min(2, "Project Key Must be At Least 2 Charcters")
    .max(10, "Project Key Must Be 10 Charcters Or Less"),
  description: z
    .string()
    .max(500, "Project Description Must Be 500 Charcters Or Less")
    .optional(),
});

export const sprintSchema = z.object({
  name: z.string().min(1, "Sprint Name Is Required"),
  startDate: z.date(),
  endDate: z.date(),
});

export const issueSchema = z.object({
  title: z.string().min(1, "Title Is Required"),
  assigneeId: z.string().uuid("Please Select Assginee"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});
