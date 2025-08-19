import {email, z} from "zod"

export const userRoleEnum = z.enum(["ADMIN", "USER", "AGENT"]);

export const userSchema=z.object({
    name:z.string().min(3).max(100),
    email:z.string().email().toLowerCase().trim(),
    password:z.string().regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        "Password must be at least 8 characters and contain letters and numbers"
    ),
    phone:z.string().trim().min(5),
    role: userRoleEnum.optional(),
})

export const loginSchema=z.object({
    email:z.email().lowercase().trim().nonoptional(),
    password:z.string().min(5).max(20).nonempty()
})

export type UserSchema=z.infer<typeof userSchema>