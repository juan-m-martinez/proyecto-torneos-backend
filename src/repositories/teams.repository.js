import teamsDAO from "../dao/teams.dao.js";

class TeamsRepository {
    async create(teamData) {
        return await teamsDAO.create(teamData);
    }

    async findById(id) {
        return await teamsDAO.findById(id);
    }

    async findByEventAndName(eventId, name) {
        return await teamsDAO.findByEventAndName(eventId, name);
    }
}

export default new TeamsRepository();