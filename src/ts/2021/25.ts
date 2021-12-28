import {Hashtable} from '../utils';

export default (rawInput: string) => {
    enum CucumberType {Empty, East, South};
    const CUCUMBER = {'.': CucumberType.Empty, '>': CucumberType.East, 'v': CucumberType.South} as Hashtable<number>;
    const grid = rawInput.split('\n').map(line => line.split('').map(v => CUCUMBER[v]));
    const HEIGHT = grid.length;
    const WIDTH = grid[0].length;

    const shuffle = () => {
        let iterations = 0;
        while (true) {
            let moved = false;

            for (let y = 0; y < HEIGHT; y++) {
                const moves = [] as number[];
                for (let x = 0; x < WIDTH; x++) {
                    if (grid[y][x] !== CucumberType.East) continue;

                    const newX = (x + 1) % WIDTH;
                    if (grid[y][newX] !== CucumberType.Empty) continue;
                    if (moves.includes(newX)) continue;

                    grid[y][x] = CucumberType.Empty;
                    grid[y][newX] = CucumberType.East;
                    moved = true;
                    moves.push(x);
                    x++;
                }
            }

            for (let x = 0; x < WIDTH; x++) {
                const moves = [] as number[];
                for (let y = 0; y < HEIGHT; y++) {
                    if (grid[y][x] !== CucumberType.South) continue;

                    const newY = (y + 1) % HEIGHT;
                    if (grid[newY][x] !== CucumberType.Empty) continue;
                    if (moves.includes(newY)) continue;

                    grid[y][x] = CucumberType.Empty;
                    grid[newY][x] = CucumberType.South;
                    moved = true;
                    moves.push(y);
                    y++;
                }
            }

            iterations++;
            if (!moved) return iterations;
        }
    };

    return [
        shuffle(),
        42,
    ];
};
