import { TeamSchema } from "../Schemas/teamSchema.js";

const getTeams = async () => {
    let filteredTeams = [];
    const teams = await TeamSchema.find();
    teams.forEach(team => {
        filteredTeams.push({name: team.name, updated: false});
    });

    return filteredTeams;
}

export default getTeams;