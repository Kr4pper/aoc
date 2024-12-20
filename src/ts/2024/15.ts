import {Grid2D, Hashtable} from '../utils';

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

    const print = (grid: Grid2D<number | string>, delimiter: string, pad?: number) => console.log(
        grid.horizontals().map(h => h.map(v => String(v).padStart(pad, ' ')).join(delimiter)).join('\n')
    );

    // PART 1
    const grid = Grid2D.parse(initialGrid);
    if (grid.width !== grid.height) throw new Error('expected square grid');

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
                console.log(grid.get(x + dx, y + dy));
                throw new Error('unexpected grid entry');
        }
    }

    // PART 2

    return [
        grid.findAll(v => v === 'O').reduce((sum, [x, y]) => sum + (x + 100 * y), 0), // 1568399
    ];
};
