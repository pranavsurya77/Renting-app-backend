import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";
import { validator } from "../middlewares/validation";
import { loginSchema, userSchema } from "../schemas/user.schema";


const router=Router()

router.post("/register",validator(userSchema,"body"),registerUser)

router.post("/login",validator(loginSchema,"body"),loginUser)

export default router