import teamsDAO from "../dao/teams.dao.js";

class TeamsRepository {
    async create(teamData) {
        return await teamsDAO.create(teamData);
    }

    async findById(id) {
        return await teamsDAO.findById(id);
    }

    async update(id, teamData) {
        return await teamsDAO.update(id, teamData);
    }

    async findByEventAndName(eventId, name) {
        return await teamsDAO.findByEventAndName(eventId, name);
    }

    async countByEvent(eventId) {
        return await teamsDAO.countByEvent(eventId);
    }
}

export default new TeamsRepository();