import {Grid2D} from '../utils';

export default (rawInput: string) => {
    type Vent = [number, number, number, number];
    const vents =
        rawInput
            .split('\n')
            .map(i => i.match(/(\d*),(\d*) -> (\d*),(\d*)/))
            .map(([_, ...values]) => values.map(Number) as Vent);

    const sortVents = (vents: Vent[]): [nonDiagonal: Vent[], diagonal: Vent[]] => {
        const nonDiagonal: Vent[] = [];
        const diagonal: Vent[] = [];

        for (const [x1, y1, x2, y2] of vents) {
            (x1 === x2 || y1 === y2 ? nonDiagonal : diagonal).push([x1, y1, x2, y2]);
        }

        return [nonDiagonal, diagonal];
    };

    const applyOverlaps = (vents: Vent[], grid: Grid2D) => {
        for (const [x1, y1, x2, y2] of vents) grid.incrementLine(x1, y1, x2, y2);

        return grid.count(v => v > 1);
    };

    const [nonDiagonal, diagonal] = sortVents(vents);
    const grid = new Grid2D(1000, 1000, 0);

    return [
        applyOverlaps(nonDiagonal, grid),
        applyOverlaps(diagonal, grid),
    ];
};
