import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../db";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken"

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
};

interface Token{
    accessToken:string,
    refreshToken:string
}

const ACCESS_SECRET=process.env.ACCESS_TOKEN_SECRET || "pranav";
const REFRESH_SECRET=process.env.REFRESH_TOKEN_SECRET || "pranav";

//generate access and refresh token
const generateTokens=(async(payload:JwtPayload):Promise<Token>=>{
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

export const loginUser = asyncHandler(async (req:Request, res:Response) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Generate tokens
    const {accessToken,refreshToken} = await generateTokens({
        id: user.id,
        email: user.email
    });

    const addedToken=await prisma.token.create({
        data:{
            token:refreshToken,
            userId:user.id,
            expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
        }
    })

    if(!addedToken){
        throw new ApiError(500,"Error while creating token")
    }

    // Send response with cookies
    res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, { accessToken, refreshToken }, "User logged in successfully"));
});


export const logoutUser=asyncHandler(async(req:Request,res:Response)=>{

    //get the user from auth middleware
    const user=await prisma.user.findUnique({
        where:{id:(req as any).id}
    })

    if(!user){
        throw new ApiError(403,"User not logged in")
    }
    //delelte token from the db
    const deleted=await prisma.token.deleteMany({
        where:{userId:user.id}
    })

    res.status(200).json(new ApiResponse(200,null,"User logged out successfully"))
})