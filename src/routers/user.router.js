import { Router } from "express";
import { registerUser, login, logout } from "../controllers/user.controller.js";

const router = Router ()
router.route("/register").post(registerUser)
router.route ("/login").post(login)

//secured routes
router.route("/logout").post(logout)
//router.route("/refresh-token").post(refreshAccessToken)
export default router