import { verifyToken } from "../utils/jwt.js";

const auth = (req, res, next) => {
    const token = req.cookies?.currentUser;

    console.log("Cookies recibidas:", req.cookies);
    console.log("Token recibido:", !!token);

    if (!token) {
        return res.status(401).json({
            status: "error",
            message: "No autenticado",
        });
    }

    try {
        const payload = verifyToken(token);

        req.user = payload;

        next();
    } catch (error) {
        console.log("Error verificando JWT:", error.message);

        return res.status(401).json({
            status: "error",
            message: "No autenticado",
        });
    }
};

export default auth;