const createClashes = (teamsLength, teams) => {
    var clashes = [];
    var actualClash = {
        rest: '',
        plays: [],
        played: false,
    };

    if (teamsLength % 4 === 0) {
        actualClash.rest = null;
        for (let i = 0; i < 4; i++) {
            organizedNoRest(teams, actualClash, clashes);
        }
    } else if (teamsLength % 4 === 1) {
        for (let i = teamsLength - 1; i >= 0; i--) {
            actualClash = { rest: '', plays: [], played: false };

            actualClash.rest = teams[i].name;
            for (let j = 0; j < teamsLength; j++) {
                if (i !== j) {
                    actualClash.plays.push(teams[j].name);
                }
            }

            clashes.push(actualClash);
        }
    } else {
        return teams;
    }

    return clashes;
};

const organizedNoRest = (teams, actualClash, clashes) => {
    let newClash = { rest: '', plays: [], played: false };

    let status = randomizeArray(teams, newClash);

    while (status) {
        status = randomizeArray(teams, newClash);
    }

    teams.forEach((team) => {
        newClash.plays.push(team.name);
    });

    actualClash.rest = newClash.rest; // Actualizar el campo 'rest' de actualClash
    clashes.push(newClash);
};

const randomizeArray = (array, orgArray) => {
    for (let i = 0; i < array.length; i++) {
        const index = Math.floor(Math.random() * (i + 1));
        [array[i], array[index]] = [array[index], array[i]];
    }

    // Verificar si el array de plays en orgArray ya contiene el nuevo array de plays
    const playsExist = orgArray.plays.some((existingPlays) =>
        JSON.stringify(existingPlays) === JSON.stringify(array)
    );

    return playsExist;
};

export default createClashes;
