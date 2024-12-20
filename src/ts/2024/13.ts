export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const parseMachine = (input: string) => {
        const [ax, ay, bx, by, px, py] = input.match(/\d+/g).map(BigInt);
        return {ax, ay, bx, by, px, py};
    };
    type Machine = ReturnType<typeof parseMachine>;
    const machines = rawInput.split('\n\n').map(parseMachine);

    const solve = ({ax, ay, bx, by, px, py}: Machine) => {
        if (ax * by - ay * bx === 0n) { // co-linear
            if (ax * py - ay * px !== 0n) {  // target not on the same line
                return 0n;
            }

            if (ax < 3n * bx) {  // a is cheaper to press
                for (let b = 0n; ; b++) {
                    const a = (px - b * bx) / ax;
                    if (a * ax + b * bx === px) {
                        return 3n * a + b;
                    }
                }
            } else {
                for (let a = 0n; ; a++) {
                    const b = (px - a * ax) / bx;
                    if (a * ax + b * bx === px) {
                        return 3n * a + b;
                    }
                }
            }
        }

        const b = (ax * py - ay * px) / (ax * by - ay * bx);
        if (b < 0n) return 0n;

        const a = (px - b * bx) / ax;
        if (a < 0n) return 0n;

        if (a * ax + b * bx !== px || a * ay + b * by !== py) return 0n;

        return 3n * a + b;
    };

    const machines2 = machines.map(m => ({...m, px: m.px + 10000000000000n, py: m.py + 10000000000000n}));

    return [
        machines.map(solve).reduce((sum, v) => sum + v, 0n).toString(),
        machines2.map(solve).reduce((sum, v) => sum + v, 0n).toString(),
    ];
};
