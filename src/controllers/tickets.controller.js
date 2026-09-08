import ticketsService from "../services/tickets.service.js";

export const registerTicket = async (req, res) => {
    try {
        const { teamId, teamPassword } = req.body;
        const { eid } = req.params;

        const ticket = await ticketsService.register(
            eid,
            req.user.id,
            teamId,
            teamPassword
        );

        return res.status(201).json({
            status: "success",
            data: ticket,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message,
        });
    }
};