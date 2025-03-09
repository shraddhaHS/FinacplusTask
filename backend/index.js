import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./src/config/db.js"
import cors from "cors"
import userRoutes from "./src/routes/user.route.js"
import cookieParser from "cookie-parser";

dotenv.config()

const app = express()

connectDB()     
    .then(() => {
        app.listen(process.env.PORT || 5001, () => {  
            console.log(`server is running at port : ${process.env.PORT}`)
        })
    }) 
    .catch((error) => {
        console.log("MONGO db connection failed", error)
    })   


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['https://registrationsystem.vercel.app','http://localhost:5173'],
    credentials:true
    }
))

app.use( "/api/user" ,userRoutes)

app.get("/" , (req,res) => {
    res.send("app is running")
})


