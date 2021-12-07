export default (rawInput: string) => {
    const vents =
        rawInput
            .split('\n')
            .map(i => i.match(/(\d*)\,(\d*) \-\> (\d*)\,(\d*)/))
            .map<[[number, number], [number, number]]>(([_, x1, y1, x2, y2]) => [[+x1, +y1], [+x2, +y2]]);

    const countOverlaps = (vents: [[number, number], [number, number]][]) => {
        const GRID = Array.from({ length: 1000 }).map(() => Array.from({ length: 1000 }).map(() => 0));

        const slope = (start: number, end: number) => start === end ? 0 : start > end ? -1 : 1;

        for (const [[x1, y1], [x2, y2]] of vents) {
            const length = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
            const dx = slope(x1, x2);
            const dy = slope(y1, y2);

            for (let i = 0; i <= length; i++) {
                GRID[x1 + i * dx][y1 + i * dy]++;
            }
        }

        return GRID.flat(1).filter(v => v > 1).length;
    };

    // PART 1
    const nonDiagonal = vents.filter(([[x1, y1], [x2, y2]]) => x1 === x2 || y1 === y2);
    console.log('Part 1:', countOverlaps(nonDiagonal));

    // PART 2
    console.log('Part 2:', countOverlaps(vents));
};
