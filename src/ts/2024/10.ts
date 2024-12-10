import {Grid2D, Point} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n').map(row => row.split('').map(Number));
    const grid = Grid2D.parse(input);

    const floodFill = (nextHeight: number) => ([x, y]: Point): Point[] => {
        if (nextHeight > 9) return [[x, y]];

        return [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]
            .filter(([x1, y1]) => grid.get(x1, y1) === nextHeight)
            .flatMap(floodFill(nextHeight + 1));
    };

    let score = 0;
    let rating = 0;
    for (const trailhead of grid.findAll(v => v === 0)) {
        const summits = floodFill(1)(trailhead);
        rating += summits.length;

        const unique = new Set(summits.map(s => s.join(',')));
        score += unique.size;
    }

    return [
        score,
        rating,
    ];
};
