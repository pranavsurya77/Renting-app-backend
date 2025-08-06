import express from "express"
import helmet from "helmet"
import compression from "compression"
import cors from "cors"

import type { Request, Response, NextFunction } from "express"
import type { CorsOptions } from "cors"
import { version } from "./middlewares/apiVersioning"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const app = express()

// Apply express middlewares
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(helmet())
app.use(compression())

const corsOptions: CorsOptions = {
    origin(origin, callback) {
        if (process.env.NODE_ENV === "development" || !origin || process.env.WHITELIST?.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Cors Error"), false)
        }
    },
}

// CORS config
if (process.env.NODE_ENV === "production") {
    app.use(cors(corsOptions))
} else {
    app.use(cors({origin: "*"}))
}

// Apply version middleware after CORS
app.use(version)

// Import routers
import healthCheckRouter from "./routes/healthcheck.routes"
import authRouter from "./routes/auth.routes"

// Routes
app.use(`/api/${process.env.VERSION}/healthcheck`, healthCheckRouter)
app.use(`/api/${process.env.VERSION}/auth`, authRouter)

export { app }