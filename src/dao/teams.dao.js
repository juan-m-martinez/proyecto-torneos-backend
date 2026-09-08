import Team from "../models/Team.js";

class TeamsDAO {
    async create(teamData) {
        return await Team.create(teamData);
    }

    async findById(id) {
        return await Team.findById(id);
    }

    async update(id, teamData) {
        return await Team.findByIdAndUpdate(
            id,
            teamData,
            {
                new: true,
                runValidators: true,
            }
        );
    }

    async findByEventAndName(eventId, name) {
        return await Team.findOne({
            event: eventId,
            name,
        });
    }

    async countByEvent(eventId) {
        return await Team.countDocuments({
            event: eventId,
        });
    }
}

export default new TeamsDAO();