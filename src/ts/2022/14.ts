import {Grid2D} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const parseRockStructure = (line: string) => {
        const anchors = line.split(' -> ').map(a => a.split(',').map(Number));
        for (let i = 0; i < anchors.length - 1; i++) {
            const [x1, y1] = anchors[i];
            const [x2, y2] = anchors[i + 1];
            terrain.incrementLine(x1, y1, x2, y2);
            lowestRock = Math.max(lowestRock, y1, y2);
        }
    };

    let lowestRock = 0;
    const terrain = new Grid2D(1000, 1000);
    rawInput.split('\n').map(parseRockStructure);

    terrain.incrementLine(0, lowestRock + 2, 1000, lowestRock + 2);

    const moves = [
        [0, 1],  // down
        [-1, 1], // down+left
        [1, 1]   // down+right
    ];

    const simulate = (exit: (y: number) => boolean) => {
        let sandAtRest = 0;
        while (true) {
            let x = 500;
            let y = 0;
            while (true) {
                const move = moves.find(([dx, dy]) => !terrain.get(x + dx, y + dy));
                if (!move) {
                    if (exit(y)) return sandAtRest;

                    terrain.increment(x, y);
                    break;
                }
                x += move[0];
                y += move[1];
            }
            sandAtRest++;
        }
    };

    const part1 = simulate(y => y > lowestRock);
    return [
        part1,
        part1 + simulate(y => y === 0)
    ];
};
