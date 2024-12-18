export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const parse = (line: string) => line.match(/(\-?\d+)/g).map(Number);
    const robots = rawInput.split('\n').map(parse);

    // PART 1
    const sample = false;
    const WIDTH = sample ? 11 : 101;
    const HEIGHT = sample ? 7 : 103;

    const getRobots = (seconds: number) => robots.map(([x1, y1, dx, dy]) => {
        const x = ((x1 + dx * seconds) % WIDTH + WIDTH) % WIDTH;
        const y = ((y1 + dy * seconds) % HEIGHT + HEIGHT) % HEIGHT;
        return [x, y];
    });

    let topLeft = 0;
    let topRight = 0;
    let bottomLeft = 0;
    let bottomRight = 0;
    for (const [x, y] of getRobots(100)) {
        const left = x < (WIDTH - 1) / 2;
        const right = x > (WIDTH - 1) / 2;
        const top = y < (HEIGHT - 1) / 2;
        const bottom = y > (HEIGHT - 1) / 2;
        if (top && left) topLeft++;
        if (top && right) topRight++;
        if (bottom && left) bottomLeft++;
        if (bottom && right) bottomRight++;
    }
    console.log({topLeft, topRight, bottomLeft, bottomRight});

    // PART 2
    const render = (seconds: number) => {
        const robots = new Set<string>();
        for (const [x, y] of getRobots(seconds)) {
            robots.add(`${x},${y}`);
        }
        let result = '';
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                result += robots.has(`${x},${y}`) ? '#' : ' ';
            }
            result += '\n';
        }
        return [result, robots.size] as const;
    };

    /*
    let max = 0;
    for (let i = 0; i < 10000; i++) {
        const [text, robots] = render(i);
        if (robots > max) {
            console.log(i, robots);
            console.log(text);
        };
        max = Math.max(robots, max);
    }
        */

    return [
        topLeft * topRight * bottomLeft * bottomRight, // 233709840
        6620,
    ];
};
