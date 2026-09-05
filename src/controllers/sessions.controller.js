import { generateToken } from "../utils/jwt.js";


export const register = async (req, res) => {
  try {
    const user = req.user;

    return res.status(201).json({
      status: "success",
      payload: {
        id: user._id.toString(),
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
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
    const { id, email, role } = req.user;

    const token = generateToken({
      id,
      email,
      role,
    });

    res.cookie("currentUser", token, { // → nombre de la cookie.
      httpOnly: true, // → JavaScript del navegador no puede leerla.
      sameSite: "lax", // → agrega protección frente a ciertos ataques entre sitios.
      maxAge: 3600000, // → duracion 1 hora.
      secure: process.env.NODE_ENV === "production", // → HTTPS.
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