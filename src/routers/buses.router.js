import { Router } from "express";
import { findBus, findSeat, bookSeat, fetchStops, fetchUserTickets, cancelTicket } from "../controllers/bus.controller.js";

const router = Router ()
router.route("/find-bus").post(findBus)
router.route("/find-seat").post(findSeat)
router.route("/book-seat").post(bookSeat)
router.route("/fetch-stops").get(fetchStops)
router.route("/fetch-all-tickets").post(fetchUserTickets)
router.route("/cancel-ticket").post(cancelTicket)
export default router