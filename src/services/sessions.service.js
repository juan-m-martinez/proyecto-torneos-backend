import usersRepository from "../repositories/users.repository.js";
import { createHash } from "../utils/hash.js";

class SessionsService {
  async register(userData) {
    const {
      first_name,
      last_name,
      email,
      password,
    } = userData; /* extración de datos*/

    // Validar campos obligatorios
    if (!first_name || !last_name || !email || !password) { /* requisitos */ 
      const error = new Error("Faltan campos obligatorios");
      error.statusCode = 400;
      throw error;
    }

    // Validar formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      const error = new Error("Email inválido");
      error.statusCode = 400;
      throw error;
    }

    // Validar longitud mínima de contraseña 
    if (password.length < 6) { 
      const error = new Error(
        "La contraseña debe tener al menos 6 caracteres"
      );
      error.statusCode = 400;
      throw error;
    }

    // Normalizar email
    const normalizedEmail = email.trim().toLowerCase(); // espacios y mayúscula

    // Verificar si el email ya existe
    const existingUser =
      await usersRepository.findByEmail(normalizedEmail); // duplicados

    if (existingUser) {
      const error = new Error("El email ya está registrado");
      error.statusCode = 409;
      throw error;
    }

    // Generar hash de la contraseña
    const hashedPassword = await createHash(password); //hash

    // Crear usuario
    const newUser = await usersRepository.create({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "user", //seguridad
    });

    // Respuesta sin password
    return {
      id: newUser._id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      role: newUser.role,
    };
  }
}

export default new SessionsService();
