import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import { createTeam, getTeam } from "../controllers/teams.controller.js";

const router = Router({ mergeParams: true });

router.post(
    "/",
    auth,
    authorize("organizer", "admin"),
    createTeam
);

router.get("/:tid", auth, getTeam);

export default router;