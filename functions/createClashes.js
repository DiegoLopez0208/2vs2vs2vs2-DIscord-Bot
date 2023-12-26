const createClashes = (teamsLength, teams) => {
    var clashes = [];
    var actualClash = {
        rest: '',
        plays: [],
        played: false,
    };

    if (teamsLength % 4 == 0) {
        actualClash.rest = null;
        for (let i = 0; i < 4; i++) {
            organizedNoRest(teams, actualClash)
        }

    } else if (teamsLength % 4 == 1) {
        for (let i = teamsLength - 1; i >= 0; i--) {
            actualClash = { rest: '', plays: [], played: false,};

            actualClash.rest = teams[i].name;
            for (let j = 0; j < teamsLength; j++) {
                if (i != j) {
                    actualClash.plays.push(teams[j].name);
                }
            }

            console.log(actualClash);
            clashes.push(actualClash);
        }
    } else {
        return teams;
    }

    return clashes;
};

const organizedNoRest = (teams, actualClash) =>
{
    let status = randomizeArray(teams, actualClash);
    
    while (status) {
        status = randomizeArray(teams, actualClash);
    }

    teams.forEach((team) => {
        actualClash.plays.push(team.name);
    });
}

const randomizeArray = (array, orgArray) => {

    for (let i = 0; i < array.length; i++) {
        const index = Math.floor(Math.random() * (i + 1));
        [array[i], array[index]] = [array[index], array[i]];
    }

    orgArray.forEach((element) => {
        if (orgArray == element) 
            return true;
    });

    return false;
};

export default createClashes;