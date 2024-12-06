import {Grid2D, range} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n');

    // PART 1
    const grid = Grid2D.parse(input);

    const slidingWindowBy4 = (line: string[]) =>
        range(0, line.length - 4).map(
            start => [line[start], line[start + 1], line[start + 2], line[start + 3]].join('')
        );

    const keywords = new Set(['XMAS', 'SAMX']);
    const part1 = [
        grid.horizontals(),
        grid.verticals(),
        grid.diagonals(),
        grid.antiDiagonals()
    ].reduce((xmas, cluster) => xmas + cluster.flatMap(slidingWindowBy4).filter(slice => keywords.has(slice)).length, 0);

    // PART 2
    const xDim = grid.width;
    const yDim = grid.height;
    let part2 = 0;
    for (let x = 0; x < xDim - 2; x++) {
        for (let y = 0; y < yDim - 2; y++) {
            if (grid.get(x + 1, y + 1) !== 'A') continue;

            const diag = new Set([grid.get(x, y), grid.get(x + 2, y + 2)]);
            if (!diag.has('M') || !diag.has('S')) continue;

            const antiDiag = new Set([grid.get(x + 2, y), grid.get(x, y + 2)]);
            if (!antiDiag.has('M') || !antiDiag.has('S')) continue;

            part2++;
        }
    }

    return [
        part1,
        part2,
    ];
};
