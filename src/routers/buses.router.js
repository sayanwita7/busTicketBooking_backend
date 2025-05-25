import { Router } from "express";
import { findBus, findSeat, bookSeat, fetchStops } from "../controllers/bus.controller.js";

const router = Router ()
router.route("/find-bus").post(findBus)
router.route("/find-seat").post(findSeat)
router.route("/book-seat").post(bookSeat)
router.route("/fetch-stops").get(fetchStops)

//secured routes
//router.route("/logout").post (logout)
//router.route("/refresh-token").post(refreshAccessToken)
export default router