import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import { registerTicket, getMyTickets, cancelTicket, getEventTickets } from "../controllers/tickets.controller.js";

const router = Router({ mergeParams: true });

router.post("/", auth, registerTicket);
router.get("/my-tickets", auth, getMyTickets);

router.patch("/:tid/cancel", auth, cancelTicket);

router.get("/", auth, getEventTickets);

export default router;