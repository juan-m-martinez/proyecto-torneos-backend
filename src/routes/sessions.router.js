import { Router } from "express";
import passport from "passport"; // Importa Passport para utilizar las estrategias de autenticación en las rutas.
import {
    register,
    login,
    current,
    logout,
} from "../controllers/sessions.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = Router();

//router.post("/register", register);
router.post("/register", (req, res, next) => {
    passport.authenticate(
        "register", // → valida + hash + crea usuario
        { session: false },
        (error, user, info) => {
            if (error) {
                return next(error);
            }

            if (!user) {
                return res.status(info?.statusCode || 400).json({
                    status: "error",
                    message:
                        info?.message === "Missing credentials"
                            ? "Faltan campos obligatorios"
                            : info?.message || "Error en el registro",
                });
            }

            req.user = user;

            return register(req, res, next);
        }
    )(req, res, next);
});
// Estrategia register

//router.post("/login", login);
router.post("/login", (req, res, next) => {
    passport.authenticate(
        "login", // → valida credenciales
        { session: false },
        (error, user, info) => {
            if (error) {
                return next(error);
            }

            if (!user) {
                return res.status(401).json({
                    status: "error",
                    message: info?.message || "Credenciales inválidas",
                });
            }

            req.user = user;

            return login(req, res, next);
        }
    )(req, res, next);
});

// router.get("/current", auth, current);
router.get("/current", auth, current);

router.post("/logout", logout);

export default router;
