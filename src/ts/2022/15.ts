import {add, Hashtable, manhattan} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    // PART 1
    const sensor = /x=(-?\d+), y=(-?\d+).*x=(-?\d+), y=(-?\d+)/;
    const toSensor = (line: string) => {
        const [_, xs, ys, xb, yb] = line.match(sensor).map(Number);
        return [xs, ys, manhattan(xs - xb, ys - yb)] as const;
    };
    const sensors = rawInput.split('\n').map(toSensor);

    const PART1_ROW = 2000000;
    const yRanges: number[][] = [];
    for (const [x, y, strength] of sensors) {
        const toPart1Row = manhattan(0, y - PART1_ROW);
        if (strength < toPart1Row) continue;

        const overlap = strength - toPart1Row;
        yRanges.push([x - overlap, x + overlap]);
    }

    const sorted = yRanges.sort(([a], [b]) => a > b ? 1 : -1);
    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i][1] < sorted[i - 1][1]) {
            sorted.splice(i, 1); // remove fully contained subsets
            i--;
        }
    }

    const withoutOverlaps = sorted.map(([start, end], i) => [start, i === sorted.length - 1 ? end : Math.min(end, sorted[i + 1][0])]);

    // PART 2
    // (A,B) belongs to top right diag X+Y and bottom right diag X-Y
    type Diagonals = Hashtable<[x: number, length: number][]>;

    const addDiag = (diagonals: Diagonals, diag: number, x: number, strength: number) => {
        if (!diagonals[diag]) diagonals[diag] = [];
        diagonals[diag].push([x, strength]);
    };

    const topRightDiags: Diagonals = {};
    const bottomRightDiags: Diagonals = {};
    for (const [x, y, strength] of sensors) {
        addDiag(topRightDiags, x + y - strength, x - strength, strength); // left -> top
        addDiag(topRightDiags, x + y + strength, x, strength); // bottom -> right
        addDiag(bottomRightDiags, x - y - strength, x - strength, strength); // left -> bottom
        addDiag(bottomRightDiags, x - y + strength, x, strength); // top -> right
    }

    const overlapCandidates = (diagonals: Diagonals) => {
        const keys = new Set(Object.keys(diagonals).map(Number));
        const res = [...keys].filter(k => keys.has(k - 2) || keys.has(k + 2));
        if (res.length !== 2) throw new Error(`Expected exactly 1 suitable pair but got [${res}] for input [${Object.keys(diagonals)}]`);
        return res;
    };

    const topRight = overlapCandidates(topRightDiags).reduce(add) / 2;
    const bottomRight = overlapCandidates(bottomRightDiags).reduce(add) / 2;
    const y = (topRight - bottomRight) / 2; // solve x+y=TR, x-y=BR
    const x = topRight - y;

    return [
        withoutOverlaps.reduce((acc, [a, b]) => acc + b - a, 0),
        4000000 * x + y,
    ];
};
