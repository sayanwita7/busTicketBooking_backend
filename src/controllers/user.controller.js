import bcrypt from "bcryptjs"
import {asyncHandler} from "../utils/asynchandler.js";
import { getConnection } from "../db/index.js";
import jwt from "jsonwebtoken"
import 'dotenv/config'

console.log("Connection starting in user controller...")
const conn = await getConnection();

const generateAccessAndRefreshTokens = async (userId, email) => {
    try {
        const accessToken = jwt.sign(
              { id: userId, email: email },
              process.env.ACCESS_SECRET,
              { expiresIn: "15m" } // short-lived
            );
        const refreshToken = jwt.sign(
              { id: userId },
              process.env.REFRESH_SECRET,
              { expiresIn: "7d" } // long-lived
            );
        return {accessToken, refreshToken}

    } catch (error) {
        throw new Error(500, "Something went wrong while generating refresh and access token.")
    }
}
const registerUser = asyncHandler (async (req, res) => {
  try {
    //get user details
    const {name, email, password, userType} = req.body
    //validation - not empty
    if (
        [name, email, password, userType].some((field) => field?.trim() === "")
    ){
        throw new Error ("All fields are required");
    }
    //Check if user already exists: username, email    
    const [rows] = await conn.execute('SELECT * FROM users WHERE email = ?',[email]);
    //const existingUser = rows[0]; 
    if (rows.length>0) {
        throw new Error ("User with email or username already exists.")
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    //create user object- create entry in database
    const userObj = {
        name: name,
        email: email,
        hashedPassword: hashedPassword,
        userType:userType,
    };
    const [createdUser] = await conn.execute(
      'INSERT INTO users (name, email, password, userType) VALUES (?, ?, ?, ?)',
      [userObj.name, userObj.email, userObj.hashedPassword, userObj.userType]
      );
    //console.log('Inserted ID:', createdUser.insertId);
    //check if user is created or blank and remove password and refresh token field from response
    const [check] = await conn.execute('SELECT * FROM users WHERE email = ? LIMIT 1',[email]);
    const checkUser = check[0]; 
    if (!checkUser) {
        throw new Error ("Something went wrong while registering the user inside.")
      }
    //return response
    return res.json ("User registered successfully!")
  } catch (error) {
    console.log(error.message)
    throw new Error("Something went wrong while registering user")
  }
})
const login = asyncHandler (async (req, res) => {
  try {
    //get user details
    const {email, password} = req.body
    //validation - not empty
    if (
        [email, password].some((field) => field?.trim() === "")
    ){
        throw new Error ("All fields are required");
    }
    const [rows] = await conn.execute('SELECT userId, password FROM users WHERE email = ? LIMIT 1',[email]);
    const user = rows[0];

    const isPasswordValid= await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw new Error ("Registered email does not match with password.")
    }
    const {accessToken, refreshToken}= await generateAccessAndRefreshTokens(user.userId, email)
    const options = {
        httpOnly: true,
        secure: true
    }
    //return response
    
    return res.cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options).json ({message: "User logged in..."})
  } catch (error) {
    console.log(error.message)
    throw new Error("Something went wrong while logging user in.")
  }

})
const logout = asyncHandler (async (req, res) => {

  const options = {
        httpOnly: true,
        secure: true
    }
  return res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .status(200)
    .json({ message: "User logged out." });

})
//await conn.end();
export {registerUser, login, logout}