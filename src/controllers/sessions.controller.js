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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await sessionsService.login(email, password);

    res.cookie("currentUser", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 3600000,
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      status: "success",
      message: "Login correcto",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Error interno del servidor",
    });
  }
};

export const current = async (req, res) => {
  const { id, email, role } = req.user;

  return res.status(200).json({
    status: "success",
    payload: {
      id,
      email,
      role,
    },
  });
};

export const logout = async (req, res) => {
  res.clearCookie("currentUser");

  return res.status(200).json({
    status: "success",
    message: "Sesión cerrada",
  });
};