import eventsRepository from "../repositories/events.repository.js";

class EventsService {
  async create(eventData) {
    const { date, capacity, price } = eventData;

    if (new Date(date) <= new Date()) {
      const error = new Error("La fecha del evento debe ser futura");
      error.statusCode = 400;
      throw error;
    }

    if (capacity <= 0) {
      const error = new Error("La capacidad debe ser mayor a 0");
      error.statusCode = 400;
      throw error;
    }

    if (price < 0) {
      const error = new Error("El precio no puede ser negativo");
      error.statusCode = 400;
      throw error;
    }

    return await eventsRepository.create(eventData);
  }

  async update(id, eventData, user) {
    const event = await eventsRepository.findById(id);

    if (!event) {
      const error = new Error("Evento no encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (event.status === "cancelled") {
      const error = new Error(
        "No se puede modificar un evento cancelado"
      );
      error.statusCode = 400;
      throw error;
    }

    const isAdmin = user.role === "admin";
    const isOwner = event.organizer.toString() === user.id;

    if (!isAdmin && !isOwner) {
      const error = new Error(
        "No tenés permisos para modificar este evento"
      );
      error.statusCode = 403;
      throw error;
    }

    if (eventData.capacity !== undefined && eventData.capacity <= 0) {
      const error = new Error("La capacidad debe ser mayor a 0");
      error.statusCode = 400;
      throw error;
    }

    if (eventData.price !== undefined && eventData.price < 0) {
      const error = new Error("El precio no puede ser negativo");
      error.statusCode = 400;
      throw error;
    }

    return await eventsRepository.update(id, eventData);
  }

  async getAll(filters = {}, options = {}) {
    const {
      page = 1,
      limit = 10,
      sort = "date",
    } = options;

    const events = await eventsRepository.findAll(filters, {
      page,
      limit,
      sort,
    });

    const total = await eventsRepository.count(filters);

    const totalPages = Math.ceil(total / limit);

    return {
      data: events,
      page,
      limit,
      total,
      totalPages,
    };
  }

  async updateStatus(id, status, user) {
    const event = await eventsRepository.findById(id);

    if (!event) {
      const error = new Error("Evento no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const allowedStatuses = [
      "draft",
      "published",
      "cancelled",
      "finished",
    ];

    if (!allowedStatuses.includes(status)) {
      const error = new Error("Estado de evento inválido");
      error.statusCode = 400;
      throw error;
    }

    if (event.status === "cancelled") {
      const error = new Error(
        "No se puede modificar el estado de un evento cancelado"
      );
      error.statusCode = 400;
      throw error;
    }

    const isAdmin = user.role === "admin";
    const isOwner = event.organizer.toString() === user.id;

    if (!isAdmin && !isOwner) {
      const error = new Error(
        "No tenés permisos para modificar este evento"
      );
      error.statusCode = 403;
      throw error;
    }
    if (
      status === "published" &&
      event.status === "finished"
    ) {
      const error = new Error(
        "No se puede publicar un evento finalizado"
      );
      error.statusCode = 400;
      throw error;
    }
    return await eventsRepository.update(id, { status });
  }

  async findById(id) {
    return await eventsRepository.findById(id);
  }
}

export default new EventsService();