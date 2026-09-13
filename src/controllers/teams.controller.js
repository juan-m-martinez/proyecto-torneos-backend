import teamsService from "../services/teams.service.js";
import { teamDTO } from "../dto/team.dto.js";

export const createTeam = async (req, res) => {
    try {
        const { name, teamPassword, captainId } = req.body;

        const { eid } = req.params;

        const team = await teamsService.create(
            eid,
            name,
            teamPassword,
            req.user, // ← organizador autenticado
            captainId
        );

        return res.status(201).json({
            status: "success",
            data: teamDTO(team)
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message,
        });
    }
};

export const getTeam = async (req, res) => {
    try {
        const { tid } = req.params;

        const team = await teamsService.findById(tid);

        if (!team) {
            return res.status(404).json({
                status: "error",
                message: "Equipo no encontrado",
            });
        }

        return res.status(200).json({
            status: "success",
            data: teamDTO(team),
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message,
        });
    }
};