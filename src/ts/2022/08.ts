import {range} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n').map(l => l.split('').map(Number));

    const X_DIM = input[0].length - 1;
    const Y_DIM = input.length - 1;

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
    let maxScore = 0;
    for (const x of range(1, X_DIM - 1)) {
        for (const y of range(1, Y_DIM - 1)) {
            const ownHeight = input[y][x];
            const visibleToLeft = (input[y].slice(0, x).reverse().findIndex(v => v >= ownHeight) + 1) || x;
            const visibleToRight = (input[y].slice(x + 1, X_DIM + 1).findIndex(v => v >= ownHeight) + 1) || (X_DIM - x);
            const visibleToTop = (range(0, y - 1).reverse().findIndex(v => input[v][x] >= ownHeight) + 1) || y;
            const visibleToBottom = (range(y + 1, Y_DIM).findIndex(v => input[v][x] >= ownHeight) + 1) || (Y_DIM - y);
            const score = visibleToLeft * visibleToRight * visibleToTop * visibleToBottom;
            maxScore = Math.max(maxScore, score);
        }
    }

    return [
        visible.size,
        maxScore,
    ];
};
