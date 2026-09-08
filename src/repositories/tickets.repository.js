import ticketsDAO from "../dao/tickets.dao.js";

class TicketsRepository {

    async create(ticketData) {
        return await ticketsDAO.create(ticketData);
    }

    async findById(id) {
        return await ticketsDAO.findById(id);
    }

    async update(id, ticketData) {
        return await ticketsDAO.update(id, ticketData);
    }

    async findActiveByUserAndEvent(userId, eventId) {
        return await ticketsDAO.findActiveByUserAndEvent(userId, eventId);
    }

    async countActiveByEvent(eventId) {
        return await ticketsDAO.countActiveByEvent(eventId);
    }

    async countActiveByTeam(teamId) {
        return await ticketsDAO.countActiveByTeam(teamId);
    }

    async findActiveByTeam(teamId, excludeTicketId) {
        return await ticketsDAO.findActiveByTeam(teamId, excludeTicketId);
    }

    async findByUser(userId) {
        return await ticketsDAO.findByUser(userId);
    }

    async findByEvent(eventId) {
        return await ticketsDAO.findByEvent(eventId);
    }
}

export default new TicketsRepository();

