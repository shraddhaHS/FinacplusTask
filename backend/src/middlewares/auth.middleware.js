import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"


export const protectRoute = async (req,res,next) => {
    try {

        const  token = req.cookies.jwt

        if(!token) {
            return res.status(401).json({message:"unauthorised- no token provided"})
        }
        // Verify the token using the JWT secret key
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
         
        if(!decoded){
            return res.status(401).json({message:"unauthorised- invalid token"})
           
        }
        // Find the user in the database using the decoded userId and exclude the password field
        const user = await User.findById(decoded.userId).select("-password")

        if(!user){
            return res.status(404).json({message: "user not found"})
        }
        // Attach the user object to the request for use in subsequent middleware or route handlers
        req.user = user
        next()
        
    } catch (error) {
     
        console.log("error in protectRoute middleware:",error.message)
        res.status(500).json({message: "internal server error"})
    }
}
