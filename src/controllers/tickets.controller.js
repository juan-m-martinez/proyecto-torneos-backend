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
    }

    catch (error) {
        return res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message,
        });
    }
};

export const getMyTickets = async (req, res) => {
    try {
        const tickets = await ticketsService.getMyTickets(req.user.id);

        return res.status(200).json({
            status: "success",
            data: tickets,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message || "Error interno del servidor",
        });
    }
};

export const getEventTickets = async (req, res) => {
    try {
        const { eid } = req.params;

        const tickets = await ticketsService.getEventTickets(
            eid,
            req.user
        );

        return res.status(200).json({
            status: "success",
            data: tickets,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message || "Error interno del servidor",
        });
    }
};


export const cancelTicket = async (req, res) => {
    try {
        const { tid } = req.params;

        const ticket = await ticketsService.cancel(
            tid,
            req.user
        );

        return res.status(200).json({
            status: "success",
            data: ticket,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message || "Error interno del servidor",
        });
    }
};