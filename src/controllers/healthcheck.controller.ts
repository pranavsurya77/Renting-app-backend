import type { Request,Response,NextFunction } from "express"

export const healthCheck=async(req:Request,res:Response)=>{
    res.json({
        success:true,
        message:"Healthcheck successfully , Server working.."
    })
}