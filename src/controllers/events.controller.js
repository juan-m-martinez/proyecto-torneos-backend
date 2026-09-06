import eventsService from "../services/events.service.js";

export const getEvents = async (req, res) => {
  try {
    const {
      status,
      category,
      location,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sort = "date",
    } = req.query;

    const filters = {};

    if (status) filters.status = status;
    if (category) filters.category = category;
    if (location) filters.location = location;

    if (dateFrom || dateTo) {
      filters.date = {};

      if (dateFrom) {
        filters.date.$gte = new Date(dateFrom);
      }

      if (dateTo) {
        filters.date.$lte = new Date(dateTo);
      }
    }

    const result = await eventsService.getAll(filters, {
      page: Number(page),
      limit: Number(limit),
      sort,
    });

    return res.status(200).json({
      status: "success",
      ...result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Error interno del servidor",
    });
  }
};


export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await eventsService.findById(id);

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Evento no encontrado",
      });
    }

    return res.status(200).json({
      status: "success",
      payload: event,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Error interno del servidor",
    });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, description, category, date, location, capacity, price, } = req.body;

    const event = await eventsService.create({
      title,
      description,
      category,
      date,
      location,
      capacity,
      price,
      organizer: req.user.id,
    });
    return res.status(201).json({
      status: "success",
      payload: {
        id: event._id.toString(),
        title: event.title,
        organizer: event.organizer.toString(),
      },
    });
  } catch (error) {
    console.error("Error al crear evento:", error);
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Error interno del servidor",
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      category,
      date,
      location,
      capacity,
      price,
    } = req.body;

    const updatedEvent = await eventsService.update(
      id,
      {
        title,
        description,
        category,
        date,
        location,
        capacity,
        price,
      },
      req.user
    );

    return res.status(200).json({
      status: "success",
      payload: {
        id: updatedEvent._id.toString(),
        title: updatedEvent.title,
        organizer: updatedEvent.organizer.toString(),
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Error interno del servidor",
    });
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedEvent = await eventsService.updateStatus(
      id,
      status,
      req.user
    );

    return res.status(200).json({
      status: "success",
      payload: {
        id: updatedEvent._id.toString(),
        title: updatedEvent.title,
        status: updatedEvent.status,
        organizer: updatedEvent.organizer.toString(),
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Error interno del servidor",
    });
  }
};
