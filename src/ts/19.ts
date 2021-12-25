export default (rawInput: string) => {
    type Point = [x: number, y: number, z: number];
    type Scanner = Point[];

    const scanners = [] as Scanner[];
    for (const scanner of rawInput.split('\n\n')) {
        let points = [] as Point[];

        for (const line of scanner.split('\n')) {
            const res = line.match(/^(-?\d+),(-?\d+),?(-?\d+)?$/);
            if (!res) continue;

            const [_, ...beacon] = res.map(Number);
            points.push(beacon.filter(v => !isNaN(v)) as any);
        }

        scanners.push(points);
    }

    console.log(scanners);

    type Rotation = (p: Point) => Point;
    const rotations: Rotation[] = [
        ([x, y, z]) => [x, y, z],
        ([x, y, z]) => [y, z, x],
        ([x, y, z]) => [z, x, y],
        ([x, y, z]) => [-x, z, y],
        ([x, y, z]) => [z, y, -x],
        ([x, y, z]) => [y, -x, z],
        ([x, y, z]) => [x, z, -y],
        ([x, y, z]) => [z, -y, x],
        ([x, y, z]) => [-y, x, z],
        ([x, y, z]) => [x, -z, y],
        ([x, y, z]) => [-z, y, x],
        ([x, y, z]) => [y, x, -z],
        ([x, y, z]) => [-x, -y, z],
        ([x, y, z]) => [-y, z, -x],
        ([x, y, z]) => [z, -x, -y],
        ([x, y, z]) => [-x, y, -z],
        ([x, y, z]) => [y, -z, -x],
        ([x, y, z]) => [-z, -x, y],
        ([x, y, z]) => [x, -y, -z],
        ([x, y, z]) => [-y, -z, x],
        ([x, y, z]) => [-z, x, -y],
        ([x, y, z]) => [-x, -z, -y],
        ([x, y, z]) => [-z, -y, -x],
        ([x, y, z]) => [-y, -x, -z],
    ];

    const part1 = (scanners: Scanner[]): number => {
        let oriented = [] as Scanner[];
        oriented.push(scanners.shift());

        while (scanners.length) {
            scanners.forEach((scanner, idx) => {
                for (const solved of oriented) {
                    for (let i = 0; i < 24; i++) {
                        const rotated = scanner.map(rotations[i]);
                        console.log(rotated);


                        if (false) {
                            oriented.push(scanners.splice(idx, 1)[0]);
                        }
                    }
                }
            });
        }

        return 0;
    };

    return [
        part1(scanners),
    ];
};
