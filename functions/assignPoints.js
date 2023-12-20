const assignPoints = (placement) => {
    switch (placement) {
        case 1:
            return 8;
        case 2:
            return 4;
        case 3:
            return 2;
        case 4:
            return 1;
    }    
}

export default assignPoints;
