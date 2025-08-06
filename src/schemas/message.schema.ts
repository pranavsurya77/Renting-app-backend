
import {z} from "zod"

export const messageSchema=z.object({
    content:z.string().min(1).max(1000),
    propertyId: z.number().int(),
    senderId: z.number().int(),
    receiverId: z.number().int(),
})

export type MessageSchema=z.infer<typeof messageSchema>
