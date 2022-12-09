import {Hashtable, range} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const motionRegex = /^([RLDU]) (\d+)$/;
    const parseMotion = (line: string) => {
        const [_, direction, steps] = line.match(motionRegex);
        return [direction, +steps] as const;
    };

    const simulateKnots = (tails: number) => {
        const visited = new Set<string>();
        let x = range(0, tails).map(() => 0);
        let y = range(0, tails).map(() => 0);

        const moveHead: Hashtable<() => void> = {
            R: () => x[0]++,
            L: () => x[0]--,
            D: () => y[0]++,
            U: () => y[0]--,
        };

        for (const [direction, steps] of rawInput.split('\n').map(parseMotion)) {
            for (let i = 0; i < steps; i++) {
                moveHead[direction]();
                for (let t = 1; t <= tails; t++) {
                    if (Math.abs(x[t - 1] - x[t]) > 1 || Math.abs(y[t - 1] - y[t]) > 1) {
                        if (y[t - 1] > y[t]) y[t]++;
                        if (y[t - 1] < y[t]) y[t]--;
                        if (x[t - 1] > x[t]) x[t]++;
                        if (x[t - 1] < x[t]) x[t]--;
                    }
                }
                visited.add(`${x[tails]},${y[tails]}`);
            }
        }

        return visited.size;
    };

    return [
        simulateKnots(1),
        simulateKnots(9),
    ];
};
