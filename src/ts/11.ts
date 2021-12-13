export default (rawInput: string) => {
    const grid = rawInput.split('\n').map(line => line.split('').map(Number));

    const HEIGHT = grid.length;
    const WIDTH = grid[0].length;
    const FLASH_MIN = 10;

    // PART 1
    type Location = [y: number, x: number];
    const getAdjacentLocations = ([y, x]: Location) => {
        const adjacent: Location[] = [];
        if (y > 0) adjacent.push([y - 1, x]);
        if (y < HEIGHT - 1) adjacent.push([y + 1, x]);
        if (x > 0) adjacent.push([y, x - 1]); // horizontal
        if (x < WIDTH - 1) adjacent.push([y, x + 1]);
        if (y > 0 && x > 0) adjacent.push([y - 1, x - 1]); // main diagonal
        if (y < HEIGHT - 1 && x < WIDTH - 1) adjacent.push([y + 1, x + 1]);
        if (y > 0 && x < WIDTH - 1) adjacent.push([y - 1, x + 1]); // antidiagonal
        if (y < HEIGHT - 1 && x > 0) adjacent.push([y + 1, x - 1]);
        return adjacent;
    };

    const simulate = (grid: number[][], maxIterations: number) => {
        let flashCount = 0;
        for (let i = 1; i <= maxIterations; i++) {
            const flashed = new Set<string>();
            const flashQueue: Location[] = [];

            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    if (++grid[y][x] >= FLASH_MIN) flashQueue.push([y, x]);
                }
            }

            while (flashQueue.length) {
                const flash = flashQueue.pop();
                const flashKey = `${flash[0]},${flash[1]}`;
                if (flashed.has(flashKey)) continue;
                flashed.add(flashKey);

                for (const [y, x] of getAdjacentLocations(flash)) {
                    if (++grid[y][x] >= FLASH_MIN) flashQueue.push([y, x]);
                }
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

    return [
        simulate(grid, 100),
        simulate(grid, 1000) + 100,
    ];
};
