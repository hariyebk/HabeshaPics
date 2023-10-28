import * as z from "zod"
// data validation for our signupform fields
export const signupValidation = z.object({
    name: z.string().min(2, {message: "Name is too short"}),
    username: z.string().min(2).max(50),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(4, {message: "Password must be at least 4 characters"})
})
