import {Grid2D} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n');
    const grid = Grid2D.parse<string>(input.map(line => line.split('')));

    const adjacent = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
    ];

    // PART 1
    let part1 = 0;
    for (let y = 0; y < grid.height; y++) {
        for (let x = 0; x < grid.width; x++) {
            if (grid.get(x, y) !== '@') continue;

            const adjacentOccupied = adjacent.reduce((occupied, [dx, dy]) => occupied + (grid.get(x + dx, y + dy) === '@' ? 1 : 0), 0);
            if (adjacentOccupied < 4) {
                part1++;
            }
        }
    }

    // PART 2
    let part2 = 0;
    let removedSomething: boolean;
    while (true) {
        removedSomething = false;
        for (let y = 0; y < grid.height; y++) {
            for (let x = 0; x < grid.width; x++) {
                if (grid.get(x, y) !== '@') continue;

                const adjacentOccupied = adjacent.reduce(
                    (occupied, [dx, dy]) => occupied + (grid.get(x + dx, y + dy) === '@' ? 1 : 0),
                    0
                );
                if (adjacentOccupied < 4) {
                    part2++;
                    removedSomething = true;
                    grid.set(x, y, 'x');
                }
            }
        }
        if (!removedSomething) break;
    }

    return [
        part1, // 1489
        part2, // 8890
    ];
};

