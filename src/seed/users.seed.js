import "dotenv/config";
import { connectDB } from "../config/database.js";
import User from "../models/User.js";
import { createHash } from "../utils/hash.js";

const seedUsers = async () => {
    try {
        await connectDB();

        const users = [
            {
                first_name: "Usuario",
                last_name: "Prueba",
                email: "user@test.com",
                password: await createHash("123456"),
                role: "user",
            },
            {
                first_name: "Organizador",
                last_name: "Prueba",
                email: "organizer@test.com",
                password: await createHash("123456"),
                role: "organizer",
            },
            {
                first_name: "Administrador",
                last_name: "Prueba",
                email: "admin@test.com",
                password: await createHash("123456"),
                role: "admin",
            },
        ];

        for (const userData of users) {
            const existingUser = await User.findOne({
                email: userData.email,
            });

            if (!existingUser) {
                await User.create(userData);
                console.log(`Usuario creado: ${userData.email}`);
            } else {
                console.log(`El usuario ya existe: ${userData.email}`);
            }
        }

        console.log("Seed de usuarios finalizado");
        process.exit(0);

    } catch (error) {
        console.error("Error ejecutando seed:", error.message);
        process.exit(1);
    }
};

seedUsers();