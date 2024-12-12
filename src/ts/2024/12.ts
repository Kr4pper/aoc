import {Grid2D, Point} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n');
    const grid = Grid2D.parse(input.map(line => line.split('')));
    const visited = new Set<string>();

    // PART 1
    let totalPrice = 0;
    const walk = (points: Point[]) => {
        const notVisited = points.filter(([x, y]) => !visited.has(`${x},${y}`));
        if (notVisited.length === 0) return;

        let regionArea = 0;
        let regionPerimeter = 0;

        const [startX, startY] = notVisited[0];
        const nextFlood: Point[] = [[startX, startY]];
        const currentRegion = grid.get(startX, startY);
        const processed = new Set<string>();

        regionArea++;
        visited.add(`${startX},${startY}`);

        while (nextFlood.length > 0) {
            const [x, y] = nextFlood.shift();

            for (const [x1, y1, direction] of [[x + 1, y, 0], [x - 1, y, 1], [x, y + 1, 2], [x, y - 1, 3]]) {
                const processedKey = `${x1},${y1},${direction}`;
                if (processed.has(processedKey)) continue;
                processed.add(processedKey);

                const tile = grid.get(x1, y1);
                if (tile !== currentRegion) {
                    if (tile && !visited.has(tile)) notVisited.push([x1, y1]); // tile in bounds
                    regionPerimeter++;
                    continue;
                }

                const visitedKey = `${x1},${y1}`;
                if (!visited.has(visitedKey)) {
                    regionArea++;
                    visited.add(visitedKey);
                    nextFlood.push([x1, y1]);
                }
            }
        }

        totalPrice += regionArea * regionPerimeter;
        walk(notVisited);
    };

    walk([[0, 0]]);

    return [
        totalPrice, // 1477924
    ];
};
