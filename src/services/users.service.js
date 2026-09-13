import usersRepository from "../repositories/users.repository.js";
import { createHash, isValidPassword } from "../utils/hash.js";

class UsersService {

    async register({ first_name, last_name, email, password }) {

        if (!first_name || !last_name || !email || !password) {
            const error = new Error("Faltan campos obligatorios");
            error.statusCode = 400;
            throw error;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            const error = new Error("Email inválido");
            error.statusCode = 400;
            throw error;
        }

        if (password.length < 6) {
            const error = new Error(
                "La contraseña debe tener al menos 6 caracteres"
            );
            error.statusCode = 400;
            throw error;
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser =
            await usersRepository.findByEmail(normalizedEmail);

        if (existingUser) {
            const error = new Error("El email ya está registrado");
            error.statusCode = 409;
            throw error;
        }

        const hashedPassword = await createHash(password);

        return await usersRepository.create({
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "user",
        });
    }

    async login(email, password) {

        const normalizedEmail = email.trim().toLowerCase();

        const user = await usersRepository.findByEmail(normalizedEmail);

        if (!user) {
            const error = new Error("Credenciales inválidas");
            error.statusCode = 401;
            throw error;
        }

        const passwordValid = await isValidPassword(
            password,
            user.password
        );

        if (!passwordValid) {
            const error = new Error("Credenciales inválidas");
            error.statusCode = 401;
            throw error;
        }

        return user;
    }
}

export default new UsersService();