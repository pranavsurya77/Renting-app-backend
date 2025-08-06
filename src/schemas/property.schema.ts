import {z} from "zod"

export const propertyEnum=z.enum(["HOUSE", "APARTMENT", "CONDO", "TOWNHOUSE", "LAND"])

export const propertySchema=z.object({
    title:z.string().min(1).max(100),
    description:z.string().min(1).max(1000),
    type: propertyEnum,
    price:z.string(),
    location:z.string().min(3).trim(),
    ownerId: z.number().int(),
})

export type PropertySchema=z.infer<typeof propertySchema>