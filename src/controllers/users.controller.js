import usersRepository from "../repositories/users.repository.js";
import { userDTO } from "../dto/user.dto.js";

export const getUsers = async (req, res) => {
    try {
        const users = await usersRepository.findAll();

        return res.status(200).json({
            status: "success",
            payload: users.map(userDTO),
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error interno del servidor",
        });
    }
};
