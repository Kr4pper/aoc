import {manhattan} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const parseLine = (line: string): [number, number] => {
        const [_, a, b] = /(\d+), (\d+)/.exec(line);
        return [a, b].map(Number) as any;
    };
    const coordinates = rawInput.split('\n').map(parseLine);

    // PART 1
    let minX = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    for (const [x, y] of coordinates) {
        minX = Math.min(x, minX);
        maxX = Math.max(x, maxX);
        minY = Math.min(y, minY);
        maxY = Math.max(y, maxY);
    }
    minX--;
    maxX++;
    minY--;
    maxY++;

    const scores = {} as {[key: number]: number;};
    const invalid = new Set<number>();
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            const distances = coordinates
                .map(([cx, cy], idx) => [idx, manhattan(x - cx, y - cy)])
                .sort(([_, a], [__, b]) => a > b ? 1 : -1);

            if (distances[0][1] === distances[1][1]) continue;

            if (x === minX || x === maxX || y === minY || y === maxY) {
                invalid.add(distances[0][0]);
                continue;
            }

            scores[distances[0][0]] = (scores[distances[0][0]] || 0) + 1;
        }
    }

    // PART 2
    let regionArea = 0;
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            const distances = coordinates.reduce((sum, [cx, cy]) => sum + manhattan(x - cx, y - cy), 0);
            if (distances >= 10_000) continue;

            regionArea++;
        }
    }

    return [
        Math.max(
            ...Object.values(
                Object.entries(scores).filter(([coordinate]) => !invalid.has(+coordinate))
            ).map(([_, v]) => v)
        ),
        regionArea,
    ];
};
