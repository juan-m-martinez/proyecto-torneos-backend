import eventsRepository from "../repositories/events.repository.js";

export const getEvents = (req, res) => {
  res.status(200).json({
    status: "success",
    payload: [],
  });
};

export const createEvent = async (req, res) => {
  try {
    const { title, description, category, date, location } = req.body;

    const event = await eventsRepository.create({
      title,
      description,
      category,
      date,
      location,
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
    console.error("Error al actualizar evento:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Error interno del servidor",
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await eventsRepository.findById(id);

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Evento no encontrado",
      });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = event.organizer.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        status: "error",
        message: "No tenés permisos para modificar este evento",
      });
    }

    const { title, description, category, date, location } = req.body;

    const updatedEvent = await eventsRepository.update(id, {
      title,
      description,
      category,
      date,
      location,
    });

    return res.status(200).json({
      status: "success",
      payload: {
        id: updatedEvent._id.toString(),
        title: updatedEvent.title,
        organizer: updatedEvent.organizer.toString(),
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Error interno del servidor",
    });
  }
};