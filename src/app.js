import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// })) 
const app = express()
app.use(cors())
app.use(express.json({limit: "16kb"})) //when taking input of data from form
app.use(express.urlencoded({extended: true, limit: "16kb" })) //configuration to take input in form of search%20item(search item), i.e. encoded url; extended for nested objects
app.use(express.static("public")) //for serving files such as html, css, images, etc from a folder/ directory
app.use(cookieParser())
//routes import
import userRouter from '../src/routers/user.router.js'
//routes declaration
app.use("/api/v1/users", userRouter)

import busRouter from '../src/routers/buses.router.js'
app.use("/api/v1/buses", busRouter)
export {app}