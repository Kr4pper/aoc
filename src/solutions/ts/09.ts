import {complement} from './utils';

export default (rawInput: string) => {
    const heightMap = rawInput.split('\n').map(line => line.split('').map(Number));

    const HEIGHT = heightMap.length;
    const WIDTH = heightMap[0].length;
    const BANNED_NUMBER = 9;

    // PART 1
    type Location = [number, number];
    const getAdjacentLocations = ([y, x]: Location) => {
        const adjacent: Location[] = [];
        if (y > 0) adjacent.push([y - 1, x]);
        if (y < HEIGHT - 1) adjacent.push([y + 1, x]);
        if (x > 0) adjacent.push([y, x - 1]);
        if (x < WIDTH - 1) adjacent.push([y, x + 1]);
        return adjacent;
    };

    const lowPoints: Location[] = [];
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const adjacent = getAdjacentLocations([y, x]);

            const current = heightMap[y][x];
            if (adjacent.every(([ya, xa]) => heightMap[ya][xa] > current)) lowPoints.push([y, x]);
        }
    }
    console.log('Part 1:', lowPoints.reduce((sum, [y, x]) => sum + 1 + heightMap[y][x], 0));

    // PART 2
    const getBasin = ([y, x]: Location) => {
        const basin = new Set<string>([`${y},${x}`]);
        let added: Location[] = [[y, x]];

        do {
            const candidates = [];
            added.forEach(([yAdded, xAdded]) =>
                candidates.push(
                    ...getAdjacentLocations([yAdded, xAdded])
                        .filter(([yCandidate, xCandidate]) => !basin.has(`${yCandidate},${xCandidate}`) && (heightMap[yCandidate][xCandidate] !== BANNED_NUMBER))
                )
            );
            added = [];

            candidates.forEach(candidate => {
                const candidateHeight = heightMap[candidate[0]][candidate[1]];
                const adjacent = [...complement(new Set(getAdjacentLocations(candidate).map(([a, b]) => `${a},${b}`)), basin)];
                if (!adjacent.every(([ya, xa]) => heightMap[ya][xa] !== BANNED_NUMBER || heightMap[ya][xa] > candidateHeight)) return;
                added.push(candidate);
            });

            added.forEach(([y, x]) => basin.add(`${y},${x}`));
        } while (added.length);

        return basin.size;
    };

    const basins = lowPoints.map(getBasin);
    const sorted = basins.sort((a, b) => b - a);
    console.log('Part 2:', sorted[0] * sorted[1] * sorted[2]);
};
