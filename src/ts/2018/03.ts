import {Grid2D, range} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const lineRegex = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/;
    const parseClaim = (line: string) => {
        const match = line.match(lineRegex);
        return [match[1], match[2], match[3], match[4], match[5]].map(v => parseInt(v));
    };

    const claims = rawInput.split('\n').map(parseClaim);
    const grid = new Grid2D(1001, 1001, 0);

    // PART 1
    for (const [_, x, y, xDim, yDim] of claims) {
        for (const xs of range(x, x + xDim - 1)) {
            for (const ys of range(y, y + yDim - 1)) grid.increment(xs, ys);
        }
    }

    // PART 2
    const uncontestedClaim = claims.find(([_, x, y, xDim, yDim]) => {
        for (const xs of range(x, x + xDim - 1)) {
            for (const ys of range(y, y + yDim - 1)) {
                if (grid.get(xs, ys) > 1) return false;
            }
        }
        return true;
    });

    return [
        grid.count(v => v >= 2),
        uncontestedClaim[0],
    ];
};
