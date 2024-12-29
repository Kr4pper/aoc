import {Grid2D} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    enum Tile {
        Wall = '#',
        Track = '.',
        Start = 'S',
        End = 'E',
    }
    const map = Grid2D.parse(rawInput.split('\n').map(line => line.split('')));
    const [startX, startY] = map.findValue(Tile.Start);
    const [endX, endY] = map.findValue(Tile.End);

    const directions = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
    ];
    const scores = new Grid2D(map.height, map.width, Number.POSITIVE_INFINITY);
    const flood = (x: number, y: number, heading: number, score: number) => {
        if (map.get(x, y) === Tile.Wall) return;
        if (scores.get(x, y) <= score) return;
        scores.set(x, y, score);

        // forward
        const [dx, dy] = directions[heading];
        flood(x + dx, y + dy, heading, score + 1);

        // left +  forward
        const leftHeading = (heading + 3) % 4;
        const [dxL, dyL] = directions[leftHeading];
        flood(x + dxL, y + dyL, leftHeading, score + 1001);

        // right + forward
        const rightHeading = (heading + 1) % 4;
        const [dxR, dyR] = directions[rightHeading];
        flood(x + dxR, y + dyR, rightHeading, score + 1001);
    };

    flood(startX, startY, 0, 0);

    // PART 2

    return [
        scores.get(endX, endY),
    ];
};
