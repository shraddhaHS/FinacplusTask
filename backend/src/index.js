import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
import cors from "cors"
import userRoutes from "./routes/user.route.js"
import cookieParser from "cookie-parser";
import path from "path"

dotenv.config()
const __dirname  = path.resolve()

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

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    })
}

app.get("/" , (req,res) => {
    res.send("app is running")
})


