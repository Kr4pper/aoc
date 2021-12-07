export default (rawInput: string) => {
    const vents =
        rawInput
            .split('\n')
            .map(i => i.match(/(\d*),(\d*) -> (\d*),(\d*)/))
            .map<number[]>(([_, ...values]) => values.map(Number));

    const GRID_SIZE = 1000;
    const slope = (start: number, end: number) => start === end ? 0 : start > end ? -1 : 1;
    const applyOverlaps = (vents: number[][], grid: number[]) => {
        for (const [x1, y1, x2, y2] of vents) {
            const length = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
            const dx = slope(x1, x2);
            const dy = slope(y1, y2);
            for (let i = 0; i <= length; i++) {
                grid[GRID_SIZE * (x1 + i * dx) + y1 + i * dy]++;
            }
        }

        return grid.filter(v => v > 1).length;
    };

    // PART 1
    const grid = new Array(GRID_SIZE * GRID_SIZE).fill(0);
    const nonDiagonal = vents.filter(([x1, y1, x2, y2]) => x1 === x2 || y1 === y2);
    console.log('Part 1:', applyOverlaps(nonDiagonal, grid));

    // PART 2
    const diagonal = vents.filter(([x1, y1, x2, y2]) => x1 !== x2 && y1 !== y2);
    console.log('Part 2:', applyOverlaps(diagonal, grid));
};
