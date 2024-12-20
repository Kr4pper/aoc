import {Grid2D, Hashtable, Point} from '../utils';

export default (input: string): [(number | string)?, (number | string)?] => {
    const DIRECTIONS: Hashtable<[number, number]> = {
        '<': [-1, 0],
        '^': [0, -1],
        '>': [1, 0],
        'v': [0, 1],
    };
    const parse = (): [string[][], string] => {
        const [_grid, ..._moves] = input.split('\n\n');
        return [
            _grid.split('\n').map(line => line.split('')),
            _moves.reduce((res, line) => res + line.trim(), '') as string
        ];
    };
    const [initialGrid, moves] = parse();

    // PART 1
    const execute = () => {
        const grid = Grid2D.parse(initialGrid);

        let [x, y] = grid.findValue('@');
        for (const move of moves) {
            const [dx, dy] = DIRECTIONS[move];
            move: switch (grid.get(x + dx, y + dy)) {
                case '.':
                    grid.set(x + dx, y + dy, '@');
                    grid.set(x, y, '.');
                    x += dx;
                    y += dy;
                    break;
                case '#':
                    break;
                case 'O':
                    for (let i = 2; ; i++) {
                        const next = grid.get(x + i * dx, y + i * dy);
                        if (next === '#' || next === undefined) break move;

                        if (next === '.') {
                            grid.set(x + i * dx, y + i * dy, 'O');
                            grid.set(x + dx, y + dy, '@');
                            grid.set(x, y, '.');
                            x += dx;
                            y += dy;
                            break move;
                        }
                    }
                default:
                    throw new Error('unexpected grid entry');
            }
        }

        return grid;
    };

    // PART 2
    const executeWide = () => {
        const widenLine = (line: string[]) => line.join('').replaceAll('#', '##').replaceAll('O', '[]').replaceAll('.', '..').replaceAll('@', '@.').split('');
        const grid = Grid2D.parse(initialGrid.map(widenLine));

        const traverse = (x: number, y: number, dx: number, dy: number, handledWide = false): [Point, string][] => {
            const current = grid.get(x, y);
            switch (current) {
                case '.':
                    return [];
                case '#':
                    return [[[-x, -y], '#']]; // not movable marker
                case '[':
                case ']':
                    if (dy === 0 || handledWide) { // horizontal
                        return [[[x, y], current], ...traverse(x + dx, y + dy, dx, dy)];
                    } else { // vertical
                        if (current === '[') {
                            return [[[x, y], current], ...traverse(x + dx, y + dy, dx, dy), ...traverse(x + 1, y, dx, dy, true)];
                        } else {
                            return [[[x, y], current], ...traverse(x + dx, y + dy, dx, dy), ...traverse(x - 1, y, dx, dy, true)];
                        }
                    }
                default:
                    throw new Error();
            }
        };

        let [x, y] = grid.findValue('@');
        for (const move of moves) {
            const [dx, dy] = DIRECTIONS[move];
            switch (grid.get(x + dx, y + dy)) {
                case '.':
                    grid.set(x + dx, y + dy, '@');
                    grid.set(x, y, '.');
                    x += dx;
                    y += dy;
                    break;
                case '#':
                    break;
                case '[':
                case ']':
                    const visitedBlocks: [Point, string][] = [[[x, y], '@'], ...traverse(x + dx, y + dy, dx, dy)];
                    if (visitedBlocks.some(([[x, y]]) => x < 0 || y < 0)) break;

                    const processed = new Set<string>();
                    for (const [[px, py], biome] of visitedBlocks.reverse()) {
                        const key = `${px},${py}`;
                        if (processed.has(key)) continue;

                        processed.add(key);
                        grid.set(px + dx, py + dy, biome);
                        grid.set(px, py, '.');
                    }
                    x += dx;
                    y += dy;
                    break;
                default:
                    throw new Error();
            }
        }

        return grid;
    };

    const score = (points: Point[]) => points.reduce((sum, [x, y]) => sum + (x + 100 * y), 0);

    return [
        score(execute().findAll(v => v === 'O')),
        score(executeWide().findAll(v => v === '[')),
    ];
};
