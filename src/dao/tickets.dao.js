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
      status: "active",
    });
  }

  async countActiveByEvent(eventId) {
    const tickets = await Ticket.find({
      event: eventId,
      status: "active",
    })
      .select("quantity")
      .lean();

    return tickets.reduce((total, ticket) => total + ticket.quantity, 0);
  }

  async update(id, ticketData) {
    return await Ticket.findByIdAndUpdate(id, ticketData, {
      new: true,
      runValidators: true,
    });
  }

  async findByUser(userId) {
    return await Ticket.find({ user: userId })
      .populate("event", "title category date location price status")
      .populate("team", "name");
  }

  async findByEvent(eventId) {
    return await Ticket.find({ event: eventId })
      .populate("user", "first_name last_name email")
      .populate("team", "name");
  }
}

export default new TicketsDAO();
