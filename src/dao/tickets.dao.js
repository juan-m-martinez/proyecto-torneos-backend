import Ticket from "../models/Ticket.js";

class TicketsDAO {

    async create(ticketData) {
        return await Ticket.create(ticketData);
    }

    async findById(id) {
        return await Ticket.findById(id);
    }

    async findActiveByUserAndEvent(userId, eventId) {
        return await Ticket.findOne({
            user: userId,
            event: eventId,
            status: { $ne: "cancelled" },
        });
    }

    async countActiveByEvent(eventId) {
        return await Ticket.countDocuments({
            event: eventId,
            status: { $ne: "cancelled" },
        });
    }

    async countActiveByTeam(teamId) {
        return await Ticket.countDocuments({
            team: teamId,
            status: { $ne: "cancelled" },
        });
    }

    async findByUser(userId) {
        return await Ticket.find({
            user: userId,
        });
    }

    async findByEvent(eventId) {
        return await Ticket.find({
            event: eventId,
        });
    }
}

export default new TicketsDAO();
