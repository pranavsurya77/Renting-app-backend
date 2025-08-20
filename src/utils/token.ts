import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError";
import type { JwtPayload } from "jsonwebtoken";

interface Token {
    accessToken: string;
    refreshToken: string;
}

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "pranav";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "pranav";

export const generateTokens = (payload: JwtPayload): Token => {
    if (!ACCESS_SECRET || !REFRESH_SECRET) {
        throw new ApiError(404, "Token secrets missing");
    }
    const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "30m" });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "10d" });

    if (!accessToken || !refreshToken) {
        throw new ApiError(500, "Error while generating tokens");
    }

    return { accessToken, refreshToken };
};
