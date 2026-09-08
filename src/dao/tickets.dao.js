import Ticket from "../models/Ticket.js";

class TicketsDAO {

    async create(ticketData) {
        return await Ticket.create(ticketData);
    }

    async findById(id) {
        return await Ticket.findOne({ _id: id });
    }

    async update(id, ticketData) {
        return await Ticket.findByIdAndUpdate(
            id,
            ticketData,
            {
                new: true,
                runValidators: true,
            }
        );
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

    async findActiveByTeam(teamId, excludeTicketId) {
        return await Ticket.findOne({
            team: teamId,
            status: { $ne: "cancelled" },
            _id: { $ne: excludeTicketId },
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
