import ticketsRepository from "../repositories/tickets.repository.js";
import eventsRepository from "../repositories/events.repository.js";
import usersRepository from "../repositories/users.repository.js";
import { sendEmail } from "../utils/mailer.js";
import { generateReservationCode } from "../utils/reservationCode.js";

class TicketsService {
  async register(eventId, userId, quantity = 1) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      const error = new Error("La cantidad debe ser un entero mayor a 0");
      error.statusCode = 400;
      throw error;
    }

    const event = await eventsRepository.findById(eventId);

    if (!event) {
      const error = new Error("Evento no encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (event.status !== "published") {
      const error = new Error(
        "El evento no está disponible para inscripciones",
      );
      error.statusCode = 400;
      throw error;
    }

    if (!Number.isInteger(event.capacity) || event.capacity <= 0) {
      const error = new Error("El evento no tiene una capacidad válida");
      error.statusCode = 400;
      throw error;
    }

    const existingTicket = await ticketsRepository.findActiveByUserAndEvent(
      userId,
      eventId,
    );

    if (existingTicket) {
      const error = new Error("Ya tenés una inscripción activa a este evento");
      error.statusCode = 409;
      throw error;
    }

    const occupiedPlaces = await ticketsRepository.countActiveByEvent(eventId);

    if (occupiedPlaces + quantity > event.capacity) {
      const error = new Error("No hay cupo suficiente para esta inscripción");
      error.statusCode = 409;
      throw error;
    }

    const reservationCode = generateReservationCode();

    const ticket = await ticketsRepository.create({
      user: userId,
      event: eventId,
      quantity,
      status: "active",
      reservationCode,
    });

    const user = await usersRepository.findById(userId);

    if (user && process.env.MAIL_USER && process.env.MAIL_PASS) {
      await sendEmail({
        to: user.email,
        subject: "Inscripción confirmada",
        text: `Tu inscripción fue confirmada.

Evento: ${event.title}
Cantidad: ${quantity}
Código de reserva: ${reservationCode}`,
      });
    }

    return ticket;
  }

  async getMyTickets(userId) {
    return await ticketsRepository.findByUser(userId);
  }

  async getEventTickets(eventId, user) {
    const event = await eventsRepository.findById(eventId);

    if (!event) {
      const error = new Error("Evento no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const isAdmin = user.role === "admin";
    const isOwner = event.organizer.toString() === user.id;

    if (!isAdmin && !isOwner) {
      const error = new Error(
        "No tenés permisos para ver los tickets de este evento",
      );
      error.statusCode = 403;
      throw error;
    }

    return await ticketsRepository.findByEvent(eventId);
  }
  async cancel(ticketId, user) {
    const ticket = await ticketsRepository.findById(ticketId);

    if (!ticket) {
      const error = new Error("Ticket no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const isAdmin = user.role === "admin";
    const isOwner = ticket.user.toString() === user.id;

    if (!isAdmin && !isOwner) {
      const error = new Error("No tenés permisos para cancelar este ticket");
      error.statusCode = 403;
      throw error;
    }

    if (ticket.status === "cancelled") {
      const error = new Error("El ticket ya está cancelado");
      error.statusCode = 400;
      throw error;
    }

    const cancelledTicket = await ticketsRepository.update(ticketId, {
      status: "cancelled",
      cancelledAt: new Date(),
    });

    const userToNotify = await usersRepository.findById(ticket.user);

    if (userToNotify && process.env.MAIL_USER && process.env.MAIL_PASS) {
      await sendEmail({
        to: userToNotify.email,
        subject: "Inscripción cancelada",
        text: `Tu inscripción fue cancelada correctamente.

Código de reserva: ${ticket.reservationCode}`,
      });
    }

    return cancelledTicket;
  }
}

export default new TicketsService();
