import ticketsService from "../services/tickets.service.js";
import { ticketDTO } from "../dto/ticket.dto.js";

export const registerTicket = async (req, res, next) => {
  try {
    const { quantity = 1 } = req.body ?? {};
    const { eid } = req.params;

    const ticket = await ticketsService.register(eid, req.user.id, quantity);

    return res.status(201).json({
      status: "success",
      payload: ticketDTO(ticket),
    });
  } catch (error) {
    return next(error);
  }
};

export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await ticketsService.getMyTickets(req.user.id);

    return res.status(200).json({
      status: "success",
      data: tickets.map(ticketDTO),
    });
  } catch (error) {
    return next(error);
  }
};

export const getEventTickets = async (req, res, next) => {
  try {
    const { eid } = req.params;
    const tickets = await ticketsService.getEventTickets(eid, req.user);

    return res.status(200).json({
      status: "success",
      data: tickets.map(ticketDTO),
    });
  } catch (error) {
    return next(error);
  }
};

export const cancelTicket = async (req, res, next) => {
  try {
    const { tid } = req.params;
    const ticket = await ticketsService.cancel(tid, req.user);

    return res.status(200).json({
      status: "success",
      data: ticketDTO(ticket),
    });
  } catch (error) {
    return next(error);
  }
};
