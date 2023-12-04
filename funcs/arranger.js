export const arrangeTeams = (teams) => {
    let auxTeam;

    for (let i = 0; i < teams.length-1; i++) {
        for (let j = i; j < teams.length; j++) {
            if (teams[i].points < teams[j].points) {
                auxTeam = teams[i];
                teams[i] = teams[j];
                teams[j] = auxTeam;
            }            
        }        
    }
}
