import {memoizeBy} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const blink = memoizeBy(
        ([n, remaining]) => `${n},${remaining}`,
        ([n, remaining]: [number, number]): number => {
            if (remaining === 0) {
                return 1;
            }

            if (n === 0) {
                return blink([1, remaining - 1]);
            }

            const asString = n.toString();
            const digitCount = asString.length;
            if (digitCount % 2 === 0) {
                return blink([+asString.substring(0, digitCount / 2), remaining - 1])
                    + blink([+asString.substring(digitCount / 2, digitCount), remaining - 1]);
            }

            return blink([n * 2024, remaining - 1]);
        }
    );

    const input = rawInput.split(' ').map(Number);
    const blinkN = (n: number) => input.reduce((sum, stone) => sum + blink([stone, n]), 0);

    return [
        blinkN(25),
        blinkN(75),
    ];
};
