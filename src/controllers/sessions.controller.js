import { generateToken } from "../utils/jwt.js";
import { userDTO } from "../dto/user.dto.js";
import usersService from "../services/users.service.js";

export const register = async (req, res, next) => {
  try {
    return res.status(201).json({
      status: "success",
      payload: userDTO(req.user),
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { id, email, role } = req.user;

    const token = generateToken({ id, email, role });

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
    return next(error);
  }
};

export const current = async (req, res, next) => {
  try {
    const user = await usersService.getById(req.user.id);

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "No autenticado",
      });
    }

    return res.status(200).json({
      status: "success",
      payload: userDTO(user),
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("currentUser");

  return res.status(200).json({
    status: "success",
    message: "Sesión cerrada",
  });
};
