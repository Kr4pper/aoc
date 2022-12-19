export default (rawInput: string): [(number | string)?, (number | string)?] => {
    // PART 1
    const adjacent = (x: number, y: number, z: number) => [
        [x - 1, y, z],
        [x + 1, y, z],
        [x, y - 1, z],
        [x, y + 1, z],
        [x, y, z - 1],
        [x, y, z + 1],
    ];

    const lava = new Set<string>();
    let MIN = Infinity;
    let MAX = -Infinity;
    let surfaceArea = 0;
    for (const line of rawInput.split('\n')) {
        const [x, y, z] = line.split(',').map(Number);

        lava.add(`${x},${y},${z}`);
        surfaceArea += 6;
        MIN = Math.min(MIN, x, y, z);
        MAX = Math.max(MAX, x, y, z);

        for (const [xx, yy, zz] of adjacent(x, y, z)) {
            if (lava.has(`${xx},${yy},${zz}`)) {
                surfaceArea -= 2;
                continue;
            }
        }
    }

    // PART 2
    const outOfBounds = (...coordinates: number[]) => coordinates.some(v => v < MIN - 1 || v > MAX + 1);

    let exteriorArea = 0;
    const visited = new Set();
    const queue = [[0, 0, 0]];
    while (queue.length) {
        let [x, y, z] = queue.shift();
        const key = `${x},${y},${z}`;
        if (visited.has(key)) continue;
        if (lava.has(key)) continue;
        if (outOfBounds(x, y, z)) continue;
        visited.add(key);

        for (const [xx, yy, zz] of adjacent(x, y, z)) {
            if (lava.has(`${xx},${yy},${zz}`)) exteriorArea++;
            queue.push([xx, yy, zz]);
        }
    }

    return [
        surfaceArea,
        exteriorArea,
    ];
};
