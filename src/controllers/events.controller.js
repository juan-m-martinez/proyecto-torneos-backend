import eventsService from "../services/events.service.js";
import { eventDTO } from "../dto/event.dto.js";

export const getEvents = async (req, res, next) => {
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
      data: result.data.map(eventDTO),
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    });
  } catch (error) {
    return next(error);
  }
};

export const getEventById = async (req, res, next) => {
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
      payload: eventDTO(event),
    });
  } catch (error) {
    return next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      date,
      location,
      capacity,
      teamsCapacity,
      playersPerTeam,
      price,
    } = req.body;

    const event = await eventsService.create({
      title,
      description,
      category,
      date,
      location,
      capacity,
      teamsCapacity,
      playersPerTeam,
      price,
      organizer: req.user.id,
    });

    return res.status(201).json({
      status: "success",
      payload: eventDTO(event),
    });
  } catch (error) {
    return next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      category,
      date,
      location,
      capacity,
      teamsCapacity,
      playersPerTeam,
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
        teamsCapacity,
        playersPerTeam,
        price,
      },
      req.user,
    );

    return res.status(200).json({
      status: "success",
      payload: eventDTO(updatedEvent),
    });
  } catch (error) {
    return next(error);
  }
};

export const updateEventStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedEvent = await eventsService.updateStatus(id, status, req.user);

    return res.status(200).json({
      status: "success",
      payload: eventDTO(updatedEvent),
    });
  } catch (error) {
    return next(error);
  }
};
