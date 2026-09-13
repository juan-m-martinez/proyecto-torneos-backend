import ticketsRepository from "../repositories/tickets.repository.js";
import eventsRepository from "../repositories/events.repository.js";
import teamsRepository from "../repositories/teams.repository.js";
import usersRepository from "../repositories/users.repository.js";

import { sendEmail } from "../utils/mailer.js";
import { isValidPassword } from "../utils/hash.js";
import { generateReservationCode } from "../utils/reservationCode.js";

class TicketsService {

    async register(eventId, userId, teamId, teamPassword) {
        const event = await eventsRepository.findById(eventId);

        if (!event) {
            const error = new Error("Evento no encontrado");
            error.statusCode = 404;
            throw error;
        }

        if (event.status !== "published") {
            const error = new Error(
                "El evento no está disponible para inscripciones"
            );
            error.statusCode = 400;
            throw error;
        }

        const team = await teamsRepository.findById(teamId);

        if (!team) {
            const error = new Error("Equipo no encontrado");
            error.statusCode = 404;
            throw error;
        }

        if (team.event.toString() !== eventId) {
            const error = new Error(
                "El equipo no pertenece a este evento"
            );
            error.statusCode = 400;
            throw error;
        }

        const passwordValid = await isValidPassword(
            teamPassword,
            team.teamPassword
        );

        if (!passwordValid) {
            const error = new Error("Contraseña de equipo incorrecta");
            error.statusCode = 401;
            throw error;
        }

        const playersCount = await ticketsRepository.countActiveByTeam(teamId);

        if (playersCount >= event.playersPerTeam) {
            const error = new Error(
                "El equipo ya alcanzó la cantidad máxima de jugadores"
            );
            error.statusCode = 400;
            throw error;
        }

        const existingTicket =
            await ticketsRepository.findActiveByUserAndEvent(userId, eventId);

        if (existingTicket) {
            const error = new Error(
                "Ya estás inscripto en este evento"
            );
            error.statusCode = 409;
            throw error;
        }

        const reservationCode = generateReservationCode();

        const ticket = await ticketsRepository.create({
            user: userId,
            event: eventId,
            team: teamId,
            quantity: 1,
            status: "confirmed",
            reservationCode,
        });

        const user = await usersRepository.findById(userId);

        if (user && process.env.SMTP_USER && process.env.SMTP_PASS) {
            await sendEmail({
                to: user.email,
                subject: "Inscripción confirmada",
                text: `Tu inscripción fue confirmada correctamente.

                Evento: ${event.title}
                Equipo: ${team.name}
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
                "No tenés permisos para ver los tickets de este evento"
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
            const error = new Error(
                "No tenés permisos para cancelar este ticket"
            );
            error.statusCode = 403;
            throw error;
        }

        if (ticket.status === "cancelled") {
            const error = new Error("El ticket ya está cancelado");
            error.statusCode = 400;
            throw error;
        }

        const team = await teamsRepository.findById(ticket.team);

        const isCaptain =
            team && team.captain?.toString() === ticket.user.toString();

        if (isCaptain) {
            const nextCaptain = await ticketsRepository.findActiveByTeam(
                ticket.team,
                ticketId
            );

            if (nextCaptain) {
                await teamsRepository.update(ticket.team, {
                    captain: nextCaptain.user,
                });
            } else {
                await teamsRepository.update(ticket.team, {
                    captain: null,
                });
            }
        }

        const cancelledTicket = await ticketsRepository.update(ticketId, {
            status: "cancelled",
            cancelledAt: new Date(),
        });

        const userToNotify = await usersRepository.findById(ticket.user);

        if (userToNotify && process.env.SMTP_USER && process.env.SMTP_PASS) {
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
