import teamsRepository from "../repositories/teams.repository.js";
import eventsRepository from "../repositories/events.repository.js";
import usersRepository from "../repositories/users.repository.js";
import ticketsRepository from "../repositories/tickets.repository.js";
import { createHash } from "../utils/hash.js";
import { generateReservationCode } from "../utils/reservationCode.js";


class TeamsService {

    async create(eventId, name, teamPassword, user, captainId) {
        const event = await eventsRepository.findById(eventId);

        if (!event) {
            const error = new Error("Evento no encontrado");
            error.statusCode = 404;
            throw error;
        }

        if (
            user.role !== "admin" &&
            event.organizer.toString() !== user.id
        ) {
            const error = new Error(
                "No tenés permisos para crear un equipo en este evento"
            );
            error.statusCode = 403;
            throw error;
        }

        const captain = await usersRepository.findById(captainId);

        if (!captain) {
            const error = new Error("Capitán no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const teamsCount = await teamsRepository.countByEvent(eventId);

        if (teamsCount >= event.teamsCapacity) {
            const error = new Error(
                "No hay cupos para crear otro equipo en este evento"
            );
            error.statusCode = 400;
            throw error;
        }

        const existingCaptainTicket =
            await ticketsRepository.findActiveByUserAndEvent(captainId, eventId);

        if (existingCaptainTicket) {
            const error = new Error(
                "El capitán ya está inscripto en este evento"
            );
            error.statusCode = 409;
            throw error;
        }

        const existingTeam = await teamsRepository.findByEventAndName(
            eventId,
            name.trim()
        );

        if (existingTeam) {
            const error = new Error(
                "Ya existe un equipo con ese nombre en este evento"
            );
            error.statusCode = 409;
            throw error;
        }

        if (!teamPassword || teamPassword.length < 6) {
            const error = new Error(
                "La contraseña del equipo debe tener al menos 6 caracteres"
            );
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await createHash(teamPassword);

        const team = await teamsRepository.create({
            name: name.trim(),
            event: eventId,
            teamPassword: hashedPassword,
            captain: captainId,
        });

        const reservationCode = generateReservationCode();

        await ticketsRepository.create({
            user: captainId,
            event: eventId,
            team: team._id,
            quantity: 1,
            status: "confirmed",
            reservationCode,
        });

        return team;
    }

    async findById(teamId) {
        return await teamsRepository.findById(teamId);
    }

}

export default new TeamsService();
