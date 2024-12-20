import {Grid2D} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const bytes = rawInput.split('\n').map(row => row.split(',').map(Number));

    // PART 1
    const sample = false;
    const DIM = sample ? 6 : 70;
    const START_BYTES = sample ? 12 : 1024;
    const memory = new Grid2D(DIM + 1, DIM + 1, '.');
    for (let idx = 0; idx < START_BYTES; idx++) {
        const [x, y] = bytes[idx];
        memory.set(x, y, '#');
    }

    const part1 = () => {
        const distances = new Grid2D(DIM + 1, DIM + 1, Number.MAX_SAFE_INTEGER);
        const flood = (x: number, y: number, accumulated: number) => {
            if (memory.get(x, y) === '#') {
                distances.set(x, y, 0);
                return;
            }
            if (distances.get(x, y) < accumulated) return;

            distances.set(x, y, accumulated);
            if (x > 0 && distances.get(x - 1, y) > accumulated + 1) {
                flood(x - 1, y, accumulated + 1);
            }
            if (x < DIM && distances.get(x + 1, y) > accumulated + 1) {
                flood(x + 1, y, accumulated + 1);
            }
            if (y > 0 && distances.get(x, y - 1) > accumulated + 1) {
                flood(x, y - 1, accumulated + 1);
            }
            if (y < DIM && distances.get(x, y + 1) > accumulated + 1) {
                flood(x, y + 1, accumulated + 1);
            }
        };
        flood(0, 0, 0);
        return distances.get(DIM, DIM);
    };

    // PART 2
    const runChunk = (lower: number, upper: number): number => {
        for (let idx = lower; idx < upper; idx++) {
            const [x, y] = bytes[idx];
            memory.set(x, y, '#');
        }
        const result = part1();
        for (let idx = lower; idx < upper; idx++) {
            const [x, y] = bytes[idx];
            memory.set(x, y, '.');
        }
        return result;
    };

    const part2 = (lower: number = START_BYTES, upper: number = bytes.length): string => {
        if (upper - lower < 2) return bytes[lower].join(',');

        const middle = Math.floor(lower + 0.50 * (upper - lower));
        for (const [start, end] of [[lower, middle], [middle + 1, upper]]) {
            if (runChunk(START_BYTES, end) === Number.MAX_SAFE_INTEGER) {
                return part2(start, end);
            }
        }
    };

    return [
        part1(),
        part2(),
    ];
};
