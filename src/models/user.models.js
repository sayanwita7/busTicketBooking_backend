import mongoose, {Schema} from "mongoose";
const userSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        minLength: 10,
        unique: true
    },
    userType: {
        type: String,
        required: true,
        enum: ["CUSTOMER", "ADMIN"],
        default:"CUSTOMER"
    }  
}, {timestamps: true, versionKey: false})
export const user = mongoose.model ("User", userSchema)