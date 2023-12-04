export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const grid = rawInput.split('\n');
    const DIM_X = grid[0].length;
    const DIM_Y = grid.length;

    function* scanForNumbers(grid: string[]): Generator<[value: number, x0: number, y0: number]> {
        let x = 0;
        let y = 0;
        while (y < DIM_Y) {
            let num = '';
            while (x < DIM_X) {
                const cell = grid[y][x];
                if (cell.match(/\d/)) num += cell;
                else if (num !== '') {
                    yield [+num, x - num.length, y];
                    num = '';
                }
                x++;
            }
            if (num !== '') {
                yield [+num, x - num.length, y];
                num = '';
            }
            x = 0;
            y++;
        }
    }

    const adjacent = (x: number, y: number, length: number) => [
        [x - 1, y - 1],
        [x - 1, y],
        [x - 1, y + 1],
        ...Array.from({length}).map((_, idx) => [x + idx, y - 1]),
        ...Array.from({length}).map((_, idx) => [x + idx, y + 1]),
        [x + length, y - 1],
        [x + length, y],
        [x + length, y + 1],
    ].filter(([x, y]) => x >= 0 && x < DIM_X - 1 && y >= 0 && y <= DIM_X - 1);

    const gears: Record<string, number[]> = {};
    const isPartNumber = ([value, x0, y0]: [number, number, number]) => {
        let found = false;
        for (const [x, y] of adjacent(x0, y0, Math.floor(Math.log10(value)) + 1)) {
            if (grid[y][x] !== '.') found = true;
            if (grid[y][x] === '*') {
                const id = `${x},${y}`;
                if (!gears[id]) gears[id] = [];
                gears[id].push(value);
            }
        }
        return found;
    };

    return [
        [...scanForNumbers(grid)]
            .filter(isPartNumber)
            .reduce((sum, [v]) => sum + v, 0),
        Object.values(gears)
            .filter(v => v.length === 2)
            .reduce((sum, parts) => sum += parts[0] * parts[1], 0),
    ];
};
