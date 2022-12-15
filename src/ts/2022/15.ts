import {manhattan} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n');

    // PART 1
    const lineRegex = /x=(-?\d+), y=(-?\d+).*x=(-?\d+), y=(-?\d+)/;
    const parseLine = (line: string) => {
        const [_, xs, ys, xb, yb] = line.match(lineRegex);
        return [xs, ys, xb, yb].map(Number);
    };

    const Y_TRACK = 2000000; // 2000000
    const yBlocks: number[][] = [];
    for (const [xs, ys, xb, yb] of input.map(parseLine)) {
        const toBeacon = manhattan(xs - xb, ys - yb);
        const toTrack = manhattan(0, ys - Y_TRACK);
        if (toBeacon < toTrack) continue;

        const overlap = toBeacon - toTrack;
        yBlocks.push([xs - overlap, xs + overlap]);
    }

    const sorted = yBlocks.sort(([a], [b]) => a > b ? 1 : -1);
    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i][1] < sorted[i - 1][1]) {
            sorted.splice(i, 1); // remove fully contained subsets
            i--;
        }
    }

    const withoutOverlaps = sorted.map(([start, end], i) =>
        i === sorted.length - 1
            ? [start, end]
            : [start, Math.min(end, sorted[i + 1][0])]
    );
    console.log(withoutOverlaps);

    // PART 2

    return [
        withoutOverlaps.reduce((acc, [a, b]) => acc + b - a, 0), // 5878678
    ];
};
