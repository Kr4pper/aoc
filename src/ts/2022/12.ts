import {Grid2D, range} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n');

    const X_DIM = input[0].length;
    const Y_DIM = input.length;
    const grid = new Grid2D(X_DIM, Y_DIM);
    let startY = 0;
    let startX = 0;
    let endY = 0;
    let endX = 0;
    for (let y = 0; y < Y_DIM; y++) {
        for (let x = 0; x < X_DIM; x++) {
            const current = input[y][x];
            if (current === 'S') {
                startY = y;
                startX = x;
                grid.set(y, x, 0); // a
                continue;
            }
            if (current === 'E') {
                endY = y;
                endX = x;
                grid.set(y, x, 25); // z
                continue;
            }
            grid.set(y, x, current.charCodeAt(0) - 'a'.charCodeAt(0));
        }
    }

    const solve = (startY: number, startX: number) => {
        const explored = new Map<string, number>().set(`${startY},${startX}`, 0);
        let q = [[startY, startX, 0]];
        while (q.length) {
            const [y, x, score] = q.shift();
            const elevation = grid.get(y, x);

            if (y === endY && x === endX) return score;

            const candidates = grid.adjacent(y, x).filter(([adjY, adjX]) => grid.get(adjY, adjX) - elevation <= 1);
            for (const [adjY, adjX] of candidates) {
                const key = `${adjY},${adjX}`;
                if (explored.has(key)) continue;

                explored.set(key, score + 1);
                q.push([adjY, adjX, score + 1]);
            }
        }

        return Number.POSITIVE_INFINITY;
    };

    return [
        solve(startY, startX),
        Math.min(
            ...range(0, Y_DIM - 1)
                .flatMap(y =>
                    range(0, X_DIM - 1)
                        .filter(x => grid.get(y, x) === 0)
                        .map(x => solve(y, x))
                )
        ),
    ];
};
