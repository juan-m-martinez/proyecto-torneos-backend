export const teamDTO = (team) => {
    if (!team) return null;

    return {
        id: team._id,
        name: team.name,
        event: team.event,
        captain: team.captain,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
    };
};