import {Grid2D, Point} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n');
    const grid = Grid2D.parse(input.map(line => line.split('')));
    const visited = new Set<string>();

    let totalPrice = 0;
    let totalDiscountedPrice = 0;
    const walk = (points: Point[]) => {
        const notVisited = points.filter(([x, y]) => !visited.has(`${x},${y}`));
        if (notVisited.length === 0) return;

        const [startX, startY] = notVisited[0];
        const nextFlood: Point[] = [[startX, startY]];
        const currentRegion = grid.get(startX, startY);
        const processed = new Set<string>();

        const isEdge = (adj1: string, adj2: string, diag: string) => {
            return (adj1 !== currentRegion && adj2 !== currentRegion)
                || (adj1 === currentRegion && adj2 === currentRegion && diag !== currentRegion);
        };

        const processEdges = (x: number, y: number) => {
            const left = grid.get(x - 1, y);
            const topLeft = grid.get(x - 1, y - 1);
            const top = grid.get(x, y - 1);
            const topRight = grid.get(x + 1, y - 1);
            const right = grid.get(x + 1, y);
            const bottomRight = grid.get(x + 1, y + 1);
            const bottom = grid.get(x, y + 1);
            const bottomLeft = grid.get(x - 1, y + 1);

            if (isEdge(left, top, topLeft)) regionEdges++;
            if (isEdge(right, top, topRight)) regionEdges++;
            if (isEdge(right, bottom, bottomRight)) regionEdges++;
            if (isEdge(left, bottom, bottomLeft)) regionEdges++;
        };

        let regionArea = 0;
        let regionPerimeter = 0;
        let regionEdges = 0;

        regionArea++;
        visited.add(`${startX},${startY}`);
        processEdges(startX, startY);

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
                    processEdges(x1, y1);
                    nextFlood.push([x1, y1]);
                }
            }
        }

        totalPrice += regionArea * regionPerimeter;
        totalDiscountedPrice += regionArea * regionEdges;
        walk(notVisited);
    };

    walk([[0, 0]]);

    return [
        totalPrice,
        totalDiscountedPrice,
    ];
};
