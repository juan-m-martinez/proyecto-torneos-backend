import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import { registerTicket, getMyTickets, cancelTicket, getEventTickets } from "../controllers/tickets.controller.js";

const ticketsRouter = Router();
const eventTicketsRouter = Router({ mergeParams: true });

ticketsRouter.get("/my-tickets", auth, getMyTickets);
ticketsRouter.patch("/:tid/cancel", auth, cancelTicket);

eventTicketsRouter.post("/", auth, registerTicket);
eventTicketsRouter.get("/", auth, getEventTickets);

export { eventTicketsRouter };
export default ticketsRouter;