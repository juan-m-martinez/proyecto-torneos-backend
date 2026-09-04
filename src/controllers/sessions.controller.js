import sessionsService from "../services/sessions.service.js";

export const register = async (req, res) => {
  try {
    const user = await sessionsService.register(req.body);

    return res.status(201).json({
      status: "success",
      payload: user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Error interno del servidor",
    });
  }
};