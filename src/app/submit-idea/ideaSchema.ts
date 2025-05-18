import { z } from "zod";

export const ideaSubmissionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  role: z.enum([
    "student",
    "lawyer",
    "engineer",
    "humanities_management",
    "entrepreneur",
    "enthusiast",
    "retired"
  ], { required_error: "Role is required" }),
  course: z.string().optional().or(z.literal("")),
  institution: z.string().optional().or(z.literal("")),
  idea_caption: z.string().min(1, "Idea caption is required"),
  description: z.string().min(1, "Description is required"),
  consent: z.boolean().refine(val => val === true, { message: "Consent is required" }),
});

export type IdeaSubmissionInput = z.infer<typeof ideaSubmissionSchema>;
