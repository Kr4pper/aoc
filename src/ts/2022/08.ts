import {Hashtable, range} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n').map(l => l.split('').map(Number));

    const X_DIM = input[0].length - 1;
    const Y_DIM = input.length - 1;

    // PART 1
    const visible = new Set<string>();
    const processHorizontal = (yRange: number[], xRange: number[]) => {
        for (const y of yRange) {
            let max = -1;
            for (const x of xRange) {
                const current = input[y][x];
                if (current <= max) continue;
                max = current;
                visible.add(`${x},${y}`);
            }
        }
    };
    processHorizontal(range(0, Y_DIM), range(0, X_DIM)); // left -> right
    processHorizontal(range(0, Y_DIM), range(0, X_DIM).reverse()); // right -> left

    const processVertical = (xRange: number[], yRange: number[]) => {
        for (const x of xRange) {
            let max = -1;
            for (const y of yRange) {
                const current = input[y][x];
                if (current <= max) continue;
                max = current;
                visible.add(`${x},${y}`);
            }
        }
    };
    processVertical(range(0, X_DIM), range(0, Y_DIM)); // top -> bottom
    processVertical(range(0, X_DIM), range(0, Y_DIM).reverse()); // bottom -> top

    // PART 2
    const visibilityList = (items: number[], reverse: boolean) => {
        const values = reverse ? [...items].reverse() : items;
        const offset = values.length - 1;
        const visibility: Hashtable<number> = {};
        const seen: number[] = [];
        for (let i = 0; i < values.length; i++) {
            const current = values[i];
            const obstacleIdx = seen.findIndex(v => v >= current);
            if (obstacleIdx !== -1) {
                visibility[reverse ? offset - i : i] = obstacleIdx + 1; // distance to obstacle
            } else {
                visibility[reverse ? offset - i : i] = seen.length; // distance to edge
            }
            seen.unshift(current);
        }
        return visibility;
    };

    const [toLeft, toRight, toTop, toBottom]: Hashtable<Hashtable<number>>[] = [{}, {}, {}, {}];

    for (const y of range(0, Y_DIM)) {
        toLeft[y] = visibilityList(input[y], false);
        toRight[y] = visibilityList(input[y], true);
    }

    for (const x of range(0, X_DIM)) {
        toTop[x] = visibilityList(range(0, Y_DIM).map(y => input[y][x]), false);
        toBottom[x] = visibilityList(range(0, Y_DIM).map(y => input[y][x]), true);
    }

    return [
        visible.size,
        Math.max(...range(0, X_DIM).flatMap(x => range(0, Y_DIM).map(y => toLeft[y][x] * toRight[y][x] * toTop[x][y] * toBottom[x][y]))),
    ];
};
