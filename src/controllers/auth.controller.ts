import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../db";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            phone,
            role,
            password: hashedPassword
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true
        }
    });

    // Send success response
    res.status(201).json(new ApiResponse(201, user, "User added successfully"));
});

const ACCESS_SECRET=process.env.ACCESS_TOKEN_SECRET || "pranav";
const REFRESH_SECRET=process.env.REFRESH_TOKEN_SECRET || "pranav";

const generateTokens=asyncHandler(async(payload:JwtPayload)=>{
    if(!ACCESS_SECRET || !REFRESH_SECRET){
        throw new ApiError(404,"Token secrets missing")
    }
    let accessToken=jwt.sign(payload,ACCESS_SECRET,{expiresIn:"30m"})
    let refreshToken=jwt.sign(payload,REFRESH_SECRET,{expiresIn:"10d"})

    if(!accessToken || !refreshToken){
        throw new ApiError(410,"Error while generating tokens")
    }

    return {accessToken,refreshToken}
})

export const loginUser=asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {email,password}=req.body

    //finding user
    const user=await prisma.user.findFirst({
        where:{email,password}
    })

    if(!user){
        throw new ApiError(404,"User not found, Enter valid credentails")
    }

    //checking password
    const isPassword=await bcrypt.compare(password,user.password);

    if(!isPassword){
        throw new ApiError(402,"Invalid credentails, Try again");
    }

    //create access and refresh token

})