import {Grid2D} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const map = Grid2D.parse(rawInput.split('\n').map(line => line.split('')));
    const WIDTH = map.width;
    const HEIGHT = map.height;
    const distances = new Grid2D(HEIGHT, WIDTH, Number.MAX_SAFE_INTEGER);
    const cheats1: number[] = [];
    const cheats2: number[] = [];
    let fromStart = 0;
    const start = map.find(v => v === 'S');
    let x = start[0];
    let y = start[1];
    distances.set(x, y, 0);
    while (true) {
        [x, y] = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].find(([cx, cy]) => map.get(cx, cy) !== '#' && distances.get(cx, cy) > fromStart);
        distances.set(x, y, ++fromStart);

        // PART 1
        const cheatCandidates = [[x - 2, y], [x + 2, y], [x, y - 2], [x, y + 2]];
        const inBounds = cheatCandidates.filter(([cx, cy]) => map.get(cx, cy) !== '#' && cx >= 0 && cx < WIDTH && cy >= 0 && cy < HEIGHT);
        cheats1.push(...inBounds.map(([cx, cy]) => fromStart - (distances.get(cx, cy) + 2)));

        // PART 2
        const MAX = 20;
        for (let dx = -MAX; dx <= MAX; dx++) {
            const MAX_Y = Math.floor(MAX - Math.abs(dx) / 2);
            for (let dy = -MAX_Y; dy <= MAX_Y; dy++) {
                if (Math.abs(dx) + Math.abs(dy) > MAX) continue;

                const cheatSkip = fromStart - (distances.get(x + dx, y + dy) + Math.abs(dx) + Math.abs(dy));
                if (cheatSkip > 0) cheats2.push(cheatSkip);
            }
        }

        if (map.get(x, y) === 'E') break;
    }

    return [
        cheats1.filter(save => save >= 100).length,
        cheats2.filter(save => save >= 100).length,
    ];
};
