import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import { getUsers } from "../controllers/users.controller.js";

const router = Router();

router.get(
    "/users",
    auth,
    authorize("admin"),
    getUsers
);

export default router;