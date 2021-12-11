export default (rawInput: string) => {
    const initialState = rawInput.split('\n').map(line => line.split('').map(Number));

    const HEIGHT = initialState.length;
    const WIDTH = initialState[0].length;
    const FLASH_MIN = 10;

    // PART 1
    type Location = [number, number];
    const getAdjacentLocations = ([y, x]: Location) => {
        const adjacent: Location[] = [];
        if (y > 0) adjacent.push([y - 1, x]); // vertical
        if (y < HEIGHT - 1) adjacent.push([y + 1, x]);
        if (x > 0) adjacent.push([y, x - 1]); // horizontal
        if (x < WIDTH - 1) adjacent.push([y, x + 1]);
        if (y > 0 && x > 0) adjacent.push([y - 1, x - 1]); // main diagonal
        if (y < HEIGHT - 1 && x < WIDTH - 1) adjacent.push([y + 1, x + 1]);
        if (y > 0 && x < WIDTH - 1) adjacent.push([y - 1, x + 1]); // antidiagonal
        if (y < HEIGHT - 1 && x > 0) adjacent.push([y + 1, x - 1]);
        return adjacent;
    };

    const increment = (grid: number[][], [y, x]: Location): Location[] => ++grid[y][x] >= FLASH_MIN ? [[y, x]] : [];

    const simulate = (grid: number[][], maxIterations: number) => {
        let flashCount = 0;
        for (let i = 1; i <= maxIterations; i++) {
            const flashed = new Set<string>();
            const flashQueue: Location[] = [];

            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) flashQueue.push(...increment(grid, [y, x]));
            }

            while (flashQueue.length) {
                const flash = flashQueue.pop();
                const flashKey = `${flash[0]},${flash[1]}`;
                if (flashed.has(flashKey)) continue;

                for (const [y, x] of getAdjacentLocations(flash)) flashQueue.push(...increment(grid, [y, x]));
                flashed.add(flashKey);
            }

            flashed.forEach(flash => {
                const [y, x] = flash.split(',').map(Number);
                grid[y][x] = 0;
            });
            flashCount += flashed.size;

            if (flashed.size === WIDTH * HEIGHT) return i; // part 2
        }
        return flashCount;
    };
    console.log('Part 1:', simulate(initialState, 100));

    // PART 2
    console.log('Part 2:', simulate(initialState, 1000));
};
