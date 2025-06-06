import { Router } from "express";
import { registerUser, login, logout } from "../controllers/user.controller.js";

const router = Router ()
router.route("/register").post(registerUser)
router.route ("/login").post(login)
router.route("/logout").post(logout)
export default router