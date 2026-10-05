const referenceDTO = (value, fields) => {
  if (!value) return null;

  const id =
    value._id?.toString?.() ??
    value.id?.toString?.() ??
    value.toString?.() ??
    null;

  const populatedFields = fields.filter(
    (field) => value[field] !== undefined,
  );

  if (populatedFields.length === 0) {
    return id;
  }

  const details = Object.fromEntries(
    populatedFields.map((field) => [field, value[field]]),
  );

  return { id, ...details };
};

export const ticketDTO = (ticket) => {
  if (!ticket) return null;

  return {
    id: ticket._id?.toString?.() ?? ticket.id,
    event: referenceDTO(ticket.event, [
      "title",
      "category",
      "date",
      "location",
      "price",
      "status",
    ]),
    user: referenceDTO(ticket.user, [
      "first_name",
      "last_name",
      "email",
    ]),
    quantity: ticket.quantity,
    status: ticket.status,
    reservationCode: ticket.reservationCode,
    createdAt: ticket.createdAt,
    cancelledAt: ticket.cancelledAt,
  };
};