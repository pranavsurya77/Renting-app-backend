declare global{
    namespace Express{
        interface Request{
            user?:{
                id:number,
                name:string,
                email:string,
                role?:string,
                phone:string,
                createdAt?:Date
                updatedAt?:Date
            }
        }
    }
}
//the above code is to add to the ts file


import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import prisma from "../db";
import { UserSchema } from "../schemas/user.schema";

const authHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized");
    }

    const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;

    if (!ACCESS_SECRET) {
        throw new ApiError(500, "Access token secret not found");
    }

    try {
        const decodedToken = jwt.verify(token, ACCESS_SECRET) as jwt.JwtPayload;
        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id },
            select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true, updatedAt: true }
        });

        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new ApiError(401, "Access token expired");
        }
        throw new ApiError(401, "Invalid access token");
    }
});

export default authHandler;
