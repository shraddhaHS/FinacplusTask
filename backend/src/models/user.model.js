import mongoose ,{Schema} from "mongoose"

const userSchema = new Schema({

   name: {
    type:String,
    required:true,
    minLength : 2,
    trim:true
   },
   age: {
    type:Number,
    required:true,
    min:0,
    max:120
   },
   dateOfBirth: {
    type:Date,
    required:true,
   },
   password: {
    type:String,
    required:true,
    minLength:10
   },
   gender : {
    type: String,
    required:true,
   },
   about: {
    type: String,
    maxLength: 5000,
    required:true
   }

},{timestamps:true})

export const User = mongoose.model("User", userSchema)


