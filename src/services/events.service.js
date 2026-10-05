import eventsRepository from "../repositories/events.repository.js";

class EventsService {
  async create(eventData) {
    const { date, capacity, teamsCapacity, playersPerTeam, price } = eventData;

    const eventDate = new Date(date);

    if (Number.isNaN(eventDate.getTime()) || eventDate <= new Date()) {
      const error = new Error("La fecha del evento debe ser futura");
      error.statusCode = 400;
      throw error;
    }

    if (!Number.isInteger(capacity) || capacity <= 0) {
      const error = new Error(
        "La capacidad debe ser un número entero mayor a 0",
      );
      error.statusCode = 400;
      throw error;
    }

    if (teamsCapacity <= 0) {
      const error = new Error("La cantidad de equipos debe ser mayor a 0");
      error.statusCode = 400;
      throw error;
    }

    if (playersPerTeam <= 0) {
      const error = new Error(
        "La cantidad de jugadores por equipo debe ser mayor a 0",
      );
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
      const error = new Error("No se puede modificar un evento cancelado");
      error.statusCode = 400;
      throw error;
    }

    const isAdmin = user.role === "admin";
    const isOwner = event.organizer.toString() === user.id;

    if (!isAdmin && !isOwner) {
      const error = new Error("No tenés permisos para modificar este evento");
      error.statusCode = 403;
      throw error;
    }

    if (eventData.date !== undefined) {
      const updatedDate = new Date(eventData.date);

      if (Number.isNaN(updatedDate.getTime()) || updatedDate <= new Date()) {
        const error = new Error("La fecha del evento debe ser futura");
        error.statusCode = 400;
        throw error;
      }
    }

    if (
      eventData.capacity !== undefined &&
      (!Number.isInteger(eventData.capacity) || eventData.capacity <= 0)
    ) {
      const error = new Error(
        "La capacidad debe ser un número entero mayor a 0",
      );
      error.statusCode = 400;
      throw error;
    }

    if (eventData.teamsCapacity !== undefined && eventData.teamsCapacity <= 0) {
      const error = new Error("La cantidad de equipos debe ser mayor a 0");
      error.statusCode = 400;
      throw error;
    }

    if (
      eventData.playersPerTeam !== undefined &&
      eventData.playersPerTeam <= 0
    ) {
      const error = new Error(
        "La cantidad de jugadores por equipo debe ser mayor a 0",
      );
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
    const { page = 1, limit = 10, sort = "date" } = options;

    if (!Number.isInteger(page) || page < 1) {
      const error = new Error("La página debe ser un entero mayor a 0");
      error.statusCode = 400;
      throw error;
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      const error = new Error("El límite debe ser un entero entre 1 y 100");
      error.statusCode = 400;
      throw error;
    }

    const allowedSorts = [
      "date",
      "-date",
      "title",
      "-title",
      "price",
      "-price",
    ];

    if (!allowedSorts.includes(sort)) {
      const error = new Error("Criterio de ordenamiento inválido");
      error.statusCode = 400;
      throw error;
    }

    const data = await eventsRepository.findAll(filters, {
      page,
      limit,
      sort,
    });

    const total = await eventsRepository.count(filters);

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateStatus(id, status, user) {
    const event = await eventsRepository.findById(id);

    if (!event) {
      const error = new Error("Evento no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const allowedStatuses = ["draft", "published", "cancelled", "finished"];

    if (!allowedStatuses.includes(status)) {
      const error = new Error("Estado de evento inválido");
      error.statusCode = 400;
      throw error;
    }

    if (event.status === "cancelled") {
      const error = new Error(
        "No se puede modificar el estado de un evento cancelado",
      );
      error.statusCode = 400;
      throw error;
    }

    const isAdmin = user.role === "admin";
    const isOwner = event.organizer.toString() === user.id;

    if (!isAdmin && !isOwner) {
      const error = new Error("No tenés permisos para modificar este evento");
      error.statusCode = 403;
      throw error;
    }

    if (status === "published" && event.status === "finished") {
      const error = new Error("No se puede publicar un evento finalizado");
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
