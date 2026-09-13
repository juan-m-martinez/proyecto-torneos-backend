export const ticketDTO = (ticket) => {
    if (!ticket) return null;

    return {
        id: ticket._id,
        status: ticket.status,
        quantity: ticket.quantity,
        reservationCode: ticket.reservationCode,
        cancelledAt: ticket.cancelledAt,
        createdAt: ticket.createdAt,
        user: ticket.user
            ? {
                  id: ticket.user._id,
                  first_name: ticket.user.first_name,
                  last_name: ticket.user.last_name,
                  email: ticket.user.email,
                  role: ticket.user.role,
              }
            : ticket.user,
        event: ticket.event,
        team: ticket.team,
    };
};
