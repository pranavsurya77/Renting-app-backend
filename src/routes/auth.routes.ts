import { Router } from "express";
import { loginUser, registerUser, logoutUser, refreshAccessToken } from "../controllers/auth.controller";
import { validator } from "../middlewares/validation";
import { loginSchema, userSchema } from "../schemas/user.schema";
import authHandler from "../middlewares/auth";

const router = Router();

router.post("/register", validator(userSchema, "body"), registerUser);
router.post("/login", validator(loginSchema, "body"), loginUser);
router.post("/logout", authHandler, logoutUser);
router.post("/refresh-token", refreshAccessToken);

export default router;
