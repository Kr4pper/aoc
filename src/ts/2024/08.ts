import {Grid2D} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const grid = Grid2D.parse(rawInput.split('\n'));
    if (grid.width !== grid.height) throw new Error('square input grid expected');
    const DIM = grid.width;

    const nodes = new Map<string, [number, number][]>();
    for (let x = 0; x < DIM; x++) {
        for (let y = 0; y < DIM; y++) {
            const value = grid.get(x, y);
            if (value === '.') continue;
            nodes.set(value, [...(nodes.get(value) || []), [x, y]]);
        }
    }

    const isInBounds = (value: number) => value >= 0 && value < DIM;

    const tryAddNode = (set: Set<string>, x: number, y: number) =>
        isInBounds(x) &&
        isInBounds(y) &&
        set.add(`${x},${y}`);

    const part1 = new Set<string>();
    const part2 = new Set<string>();
    for (const [_, antennas] of nodes.entries()) {
        for (let i = 0; i < antennas.length - 1; i++) {
            const [x1, y1] = antennas[i];

            for (let j = i + 1; j < antennas.length; j++) {
                const [x2, y2] = antennas[j];
                const dx = x2 - x1;
                const dy = y2 - y1;

                tryAddNode(part1, x1 - dx, y1 - dy);
                tryAddNode(part1, x1 + 2 * dx, y1 + 2 * dy);

                let diag1 = 0;
                while (tryAddNode(part2, x1 + diag1 * dx, y1 + diag1 * dy)) diag1++;
                let diag2 = 0;
                while (tryAddNode(part2, x1 - diag2 * dx, y1 - diag2 * dy)) diag2++;
            }
        }
    }

    return [
        part1.size,
        part2.size,
    ];
};
