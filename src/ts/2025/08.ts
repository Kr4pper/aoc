type Point = [number, number, number];

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n');
    const boxes = input.map(line => line.split(',').map(Number) as Point);

    // PART 1
    const euclideanDistance = ([x1, y1, z1]: Point, [x2, y2, z2]: Point) =>
        Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2));

    const stringify = ([x, y, z]: Point) => `${x}-${y}-${z}`;

    const distances = boxes.map((box1, idx1) =>
        boxes.filter((_, idx2) => idx2 > idx1).map(box2 => [
            euclideanDistance(box1, box2),
            stringify(box1),
            stringify(box2)
        ] as const)
    ).flat();
    distances.sort(([a], [b]) => a > b ? 1 : -1);

    const circuits = new Map<string, string[]>(boxes.map(box => [stringify(box), [stringify(box)]]));
    const circuitMap = new Map<string, string>(boxes.map(box => [stringify(box), stringify(box)]));

    const mergeCircuits = (circuit1Id: string, circuit2Id: string) => {
        if (circuit1Id === circuit2Id) return; // part of the same circuit already

        const circuit1 = circuits.get(circuit1Id);
        const circuit2 = circuits.get(circuit2Id);

        for (const pointInCircuit2 of circuit2) {
            circuitMap.set(pointInCircuit2, circuit1Id);
            circuit1.push(pointInCircuit2);
        }
        circuits.delete(circuit2Id);
    };

    const part1 = () => {
        for (let i = 0; i < 1000; i++) {
            const [_, p1, p2] = distances[i];
            const circuit1Id = circuitMap.get(p1);
            const circuit2Id = circuitMap.get(p2);

            mergeCircuits(circuit1Id, circuit2Id);
        }

        return [...circuits.values()]
            .sort((a, b) => a.length < b.length ? 1 : -1)
            .filter((_, idx) => idx < 3)
            .reduce((acc, v) => acc * v.length, 1);
    };

    // PART 2
    const part2 = () => {
        for (let i = 0; ; i++) {
            const [_, p1, p2] = distances[i];
            const circuit1Id = circuitMap.get(p1);
            const circuit2Id = circuitMap.get(p2);

            mergeCircuits(circuit1Id, circuit2Id);

            if (circuits.size === 1) {
                return eval([p1, p2].map(p => p.split('-')[0]).join('*'));
            }
        }
    };

    return [
        part1(), // 26400
        part2(), // 8199963486
    ];
};
