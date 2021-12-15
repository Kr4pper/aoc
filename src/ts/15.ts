export default (rawInput: string) => {
    const grid = rawInput.split('\n').map(v => v.split('').map(Number));

    // PART 1
    const adjacent = (gridSize: number, x: number, y: number): [number, number][] => {
        const res = [] as [number, number][];
        if (x > 0) res.push([x - 1, y]);
        if (x < gridSize - 1) res.push([x + 1, y]);
        if (y > 0) res.push([x, y - 1]);
        if (y < gridSize - 1) res.push([x, y + 1]);
        return res;
    };

    function solve(gridSize: number, map: (y: number, x: number) => number): number {
        const distances = [];
        const visits = [];
        for (let y = 0; y < gridSize; ++y) {
            const done_row = [];
            const dist_row = [];
            for (let x = 0; x < gridSize; ++x) {
                done_row[x] = 1;
                dist_row[x] = Infinity;
            }
            visits.push(done_row);
            distances.push(dist_row);
        }
        distances[0][0] = 0;
        visits[0][0] = 2;

        const queue = [[0, 0]];
        while (queue.length > 0) {
            // obtain minimum distance element
            let minDistance = Infinity;
            let minDistanceIdx = 0;
            for (let i = 0; i < queue.length; i++) {
                const [yy, xx] = queue[i];
                if (distances[yy][xx] < minDistance) {
                    minDistance = distances[yy][xx];
                    minDistanceIdx = i;
                }
            }
            const [y, x] = queue[minDistanceIdx];

            // remove element from queue
            queue[minDistanceIdx] = queue[queue.length - 1];
            queue.length--;

            visits[y][x] = 3;
            for (const [yy, xx] of adjacent(gridSize, y, x)) {
                if (visits[yy][xx] == 3) continue;

                distances[yy][xx] = Math.min(distances[yy][xx], distances[y][x] + map(yy, xx));
                if (visits[yy][xx] == 1) {
                    visits[yy][xx] = 2;
                    queue.push([yy, xx]);
                }
            }
        }
        return distances[gridSize - 1][gridSize - 1];
    }

    const gridSize = grid.length;
    return [
        solve(gridSize, (y, x) => grid[y][x]),
        solve(gridSize * 5, (y, x) => (grid[y % gridSize][x % gridSize] + Math.floor(x / gridSize) + Math.floor(y / gridSize) + 8) % 9 + 1)
    ];
};
