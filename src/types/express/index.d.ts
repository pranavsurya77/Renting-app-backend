import { User } from "@prisma/client";

declare global {
    namespace Express {
        export interface Request {
            user?: {
                id: number;
                name: string;
                email: string;
                role?: string;
                phone: string;
                createdAt?: Date;
                updatedAt?: Date;
            };
        }
    }
}
