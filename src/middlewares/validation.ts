import * as z from "zod"
import type { ZodSchema } from "zod";
import type { Request,Response,NextFunction } from "express"

export const validator=<T>(schema:ZodSchema<T>,content:"body"|"query"|"params")=>(req:Request,res:Response,next:NextFunction)=>{
    const data=req[content];
    const result=schema.safeParse(data)
    if(!result.success){
        return res.status(400).json({
            success:false,
            error:result.error.issues,
            message:"Validation error"
        })
    }
    next()
}