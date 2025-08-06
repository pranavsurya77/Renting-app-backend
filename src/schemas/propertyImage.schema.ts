
import {z} from "zod"

export const propertyImageSchema=z.object({
    url:z.string().url(),
    propertyId: z.number().int(),
})

export type PropertyImageSchema=z.infer<typeof propertyImageSchema>
