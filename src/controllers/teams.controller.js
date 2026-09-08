import teamsService from "../services/teams.service.js";

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
            data: team,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message,
        });
    }
};