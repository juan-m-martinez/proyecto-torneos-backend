import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import { registerTicket } from "../controllers/tickets.controller.js";

const router = Router({ mergeParams: true });

router.post("/", auth, registerTicket);

export default router;