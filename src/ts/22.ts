/**
 * ported from https://github.com/tginsberg/advent-2021-kotlin/blob/master/src/main/kotlin/com/ginsberg/advent2021/Day22.kt
 */

export default (input: string) => {
    type Cube = [on: boolean, x1: number, x2: number, y1: number, y2: number, z1: number, z2: number];
    const toCube = (line: string): Cube => {
        const [_, instruction, x1, x2, y1, y2, z1, z2] = line.match(/^(.*) x=(-?\d*)..(-?\d*),y=(-?\d*)..(-?\d*),z=(-?\d*)..(-?\d*)/);
        return [instruction === 'on', ...[x1, x2, y1, y2, z1, z2].map(v => +v)] as Cube;
    };
    const cubes = input.split('\n').map(toCube);

    const overlap = (a1: number, a2: number, b1: number, b2: number): [number, number] => {
        if (b2 < a1) return; // b left of a
        if (b1 > a2) return; // b right of a

        return [Math.max(a1, b1), Math.min(a2, b2)];
    };

    const intersection = (left: Cube) => (right: Cube): Cube => {
        const x = overlap(left[1], left[2], right[1], right[2]);
        if (!x) return;

        const y = overlap(left[3], left[4], right[3], right[4]);
        if (!y) return;

        const z = overlap(left[5], left[6], right[5], right[6]);
        if (!z) return;

        return [!right[0], ...x, ...y, ...z];
    };

    const volume = ([_, x1, x2, y1, y2, z1, z2]: Cube) => (x2 - x1 + 1) * (y2 - y1 + 1) * (z2 - z1 + 1);

    const totalVolume = (cubes: Cube[]) => {
        const volumes: Cube[] = [];
        for (const cube of cubes) {
            volumes.push(...volumes.map(intersection(cube)).filter(v => v));

            if (cube[0]) volumes.push(cube);
        }

        return volumes.reduce((sum, v) => sum + volume(v) * (v[0] ? 1 : -1), 0);
    };

    const part1Cube: Cube = [null, -50, 50, -50, 50, -50, 50];
    return [
        totalVolume(cubes.filter(intersection(part1Cube))),
        totalVolume(cubes),
    ];
};
