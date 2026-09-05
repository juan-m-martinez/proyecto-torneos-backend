import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport"; // Importa Passport para integrarlo con Express.
import { configurePassport } from "./config/passport.config.js"; // Importa nuestra configuración centralizada.

import eventsRouter from "./routes/events.router.js";
import sessionsRouter from "./routes/sessions.router.js";

const app = express();
configurePassport(); // Registra las estrategias de autenticación en Passport.

app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize()); // Inicializa Passport como middleware de Express.

app.use("/api/events", eventsRouter);
app.use("/api/sessions", sessionsRouter);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Servidor activo",
  });
});

export default app;
