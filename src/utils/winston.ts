import winston, { error } from "winston";

const transports:winston.transport[]=[]

const {combine,colorize,align,printf,timestamp,errors,json}=winston.format

if(process.env.NODE_ENV!=="production"){
    transports.push(new winston.transports.Console({
        format:combine(
            colorize(),
            timestamp({format:"YYYY-MM-DD hh-mm-ss"}),
            align(),
            printf(({timestamp,level,message})=>{
                return(`${timestamp} ${level} - ${message}`);
            })
        )
    }))
}

const logger=winston.createLogger({
    level: process.env.NODE_ENV==="development"? "debug":"info",
    format:winston.format.combine(
        colorize({all:true}),
        timestamp(),
        errors({stack:true}),
        json()
    ),
    transports:transports
})

export default logger