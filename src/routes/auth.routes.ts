import { Router } from "express";
import { registerUser } from "../controllers/auth.controller";
import { validator } from "../middlewares/validation";
import { userSchema } from "../schemas/user.schema";


const router=Router()

router.post("/register",validator(userSchema,"body"),registerUser)

export default router