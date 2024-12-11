import {Grid2D} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n').map(line => line.split(''));

    // PART 1
    const map = Grid2D.parse(input);
    const [startX, startY] = map.findValue('^');

    const DIRECTIONS = [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
    ];

    const visited = new Set<string>();
    let [x, y] = [startX, startY];
    let heading = 0;
    while (true) {
        visited.add(`${x},${y}`);
        const [dx, dy] = DIRECTIONS[heading];
        const next = map.get(x + dx, y + dy);
        if (next === '.' || next === '^') {
            x += dx;
            y += dy;
        }
        else if (next === '#') {
            heading = (heading + 1) % 4;
        }
        else break; // out of bounds
    }

    // PART 2
    const mapHasLoop = (grid: Grid2D<string>) => {
        const visitedObstacles = new Set<string>();
        let [x, y] = [startX, startY];
        let heading = 0;
        while (true) {
            const [dx, dy] = DIRECTIONS[heading];
            const next = grid.get(x + dx, y + dy);
            if (next === '.' || next === '^') {
                x += dx;
                y += dy;
            }
            else if (next === '#') {
                const movement = `${x},${y},${heading}`;
                if (visitedObstacles.has(movement)) {
                    return true;
                }

                visitedObstacles.add(movement);
                heading = (heading + 1) % 4;
            }
            else {
                return false; // out of bounds
            }
        }
    };

    let potentialLoops = 0;
    for (let x = 0; x < map.width; x++) {
        for (let y = 0; y < map.height; y++) {
            if (map.get(x, y) !== '.') continue;
            if (!visited.has(`${x},${y}`)) continue;

            map.set(x, y, '#');
            if (mapHasLoop(map)) potentialLoops++;
            map.set(x, y, '.');
        }
    }

    return [
        visited.size,
        potentialLoops,
    ];
};
