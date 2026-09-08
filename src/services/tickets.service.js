import ticketsRepository from "../repositories/tickets.repository.js";
import eventsRepository from "../repositories/events.repository.js";
import teamsRepository from "../repositories/teams.repository.js";
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

        return ticket;
    }
}

export default new TicketsService();
