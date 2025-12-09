export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n');
    const points = input.map(line => line.split(',').map(Number));

    // PART 1
    const areas1 = points.map(([x1, y1], idx1) =>
        points.filter((_, idx2) => idx2 >= idx1)
            .map(([x2, y2]) => (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1))
    ).flat();

    // PART 2
    type Corner = [number, number];
    type Edge = {x1: number, y1: number, x2: number, y2: number;};
    const corners: Corner[] = [];
    const edges: Edge[] = [];

    for (let i = 0; i < points.length; i++) {
        const [x1, y1] = points[i];
        const [x2, y2] = points[(i + 1) % points.length];

        corners.push([x1, y1]);
        edges.push({x1, y1, x2, y2});
    }

    const intersectsAnyEdge = (minX: number, minY: number, maxX: number, maxY: number) => {
        for (const {x1, x2, y1, y2} of edges) {
            if (minX < Math.max(x1, x2)
                && maxX > Math.min(x1, x2)
                && minY < Math.max(y1, y2)
                && maxY > Math.min(y1, y2)) {
                return true;
            }
        }
        return false;
    };

    let part2 = 0;
    for (let i = 0; i < points.length - 1; i++) {
        for (let j = i; j < points.length; j++) {
            const [fromX, fromY] = corners[i];
            const [toX, toY] = corners[j];
            const minX = Math.min(fromX, toX);
            const maxX = Math.max(fromX, toX);
            const minY = Math.min(fromY, toY);
            const maxY = Math.max(fromY, toY);

            if (!intersectsAnyEdge(minX, minY, maxX, maxY)) {
                part2 = Math.max(part2, (Math.abs(minX - maxX) + 1) * (Math.abs(minY - maxY) + 1));
            }
        }
    }

    return [
        Math.max(...areas1), // 4764078684
        part2, // 1652344888
    ];
};
