import {Grid2D, memoizeBy} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n').map(line => line.split(''));
    const grid = Grid2D.parse(input);

    // PART 1
    const start = grid.find(v => v === 'S');
    let splits = 0;
    let tachyons: [number, number][] = [start];
    for (let y = 0; y <= grid.height; y++) {
        const addIfValid = (tx: number, ty: number) => {
            if (tx < 0 || tx > grid.width) return;
            if (ty > grid.height) return;
            if (nextTachyons.some(([_x, _y]) => _x === tx && _y === ty)) return;

            grid.set(tx, ty, '|');
            nextTachyons.push([tx, ty]);
            return true;
        };

        const nextTachyons: [number, number][] = [];
        for (const [tx, ty] of tachyons) {
            if (grid.get(tx, ty + 1) === '^') {
                const leftAdded = addIfValid(tx - 1, ty + 1);
                const rightAdded = addIfValid(tx + 1, ty + 1);
                if (leftAdded || rightAdded) splits++;
            }
            else {
                grid.set(tx, ty + 1, '|');
                nextTachyons.push([tx, ty + 1]);
            }
        }

        tachyons = nextTachyons;
    }

    // PART 2
    const getRecursiveSplits = memoizeBy(
        ([x, y]) => `${x}-${y}`,
        ([x, y]: [number, number]): number => {
            if (x < 0 || x > grid.height) return 0;
            if (y === grid.height) return 1;

            return grid.get(x, y) === '^'
                ? getRecursiveSplits([x - 1, y + 1]) + getRecursiveSplits([x + 1, y + 1])
                : getRecursiveSplits([x, y + 1]);
        });

    return [
        splits, // 1698
        getRecursiveSplits(start), // 95408386769474
    ];
};
