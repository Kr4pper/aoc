import {Grid2D} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n').map(line => line.split(''));

    // PART 1
    const map = Grid2D.parse(input);
    const [startX, startY] = map.findValue('^');
    map.set(startX, startY, '.');

    const DIRECTIONS = [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
    ];

    const visited = new Set<string>();
    const jumps: [x: number, y: number, heading: number][] = [];
    let [x, y] = [startX, startY];
    let heading = 0;
    while (true) {
        visited.add(`${x},${y}`);
        const [dx, dy] = DIRECTIONS[heading];
        const next = map.get(x + dx, y + dy);
        if (next === '.') {
            x += dx;
            y += dy;
        }
        else if (next === '#') {
            jumps.push([x, y, heading]);
            heading = (heading + 1) % 4;
        }
        else break; // out of bounds
    }

    // PART 2
    const isBetween = (a: number, b: number, test: number) => {
        const min = Math.min(a, b);
        const max = Math.max(a, b);
        return test >= min && test <= max;
    };

    let steps = 0;
    const mapHasLoop = (grid: Grid2D<string>, obstacleX: number, obstacleY: number) => {
        const previousTurns = new Set<string>();
        let [x, y] = [startX, startY];
        let heading = 0;
        let jumpIdx = 0;
        /*
        while (true) { // advance until jumps are interrupted by new obstacle
            steps++;
            const [nextX, nextY, nextHeading] = jumps[jumpIdx++];
            if ((x === nextX && isBetween(y, nextY, obstacleY))
                || (y === nextY && isBetween(x, nextX, obstacleX))) {
                break;
            }
            previousTurns.add(`${x},${y},${heading}`);
            [x, y] = [nextX, nextY];
            heading = nextHeading;
        }
        */
        while (true) {
            steps++;
            const [dx, dy] = DIRECTIONS[heading];
            const next = grid.get(x + dx, y + dy);
            if (next === '.') {
                x += dx;
                y += dy;
            }
            else if (next === '#') {
                const movement = `${x},${y},${heading}`;
                /*
                const jump = jumps.findIndex(([_x, _y, _heading]) => x === _x && y === _y && heading === _heading);
                if (jump > -1) {
                    //console.log(jump, jumps[jump]);
                    return true;
                }
                    */
                if (previousTurns.has(movement)) {
                    return true;
                }

                previousTurns.add(movement);
                heading = (heading + 1) % 4;
            }
            else return false; // out of bounds
        }
    };

    let loops = 0;
    for (let x = 0; x < map.width; x++) {
        for (let y = 0; y < map.height; y++) {
            if (map.get(x, y) !== '.') continue;
            if (!visited.has(`${x},${y}`)) continue; // not on original path

            map.set(x, y, '#');
            if (mapHasLoop(map, x, y)) loops++;
            map.set(x, y, '.');
        }
    }

    return [
        visited.size,
        loops,
    ];
};
