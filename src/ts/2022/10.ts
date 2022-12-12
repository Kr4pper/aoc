import {add, range} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    // PART 1
    let sum = 1;
    let cycle = 1;
    let valueAt = new Map<number, number>();
    for (const line of rawInput.split('\n')) {
        const match = line.match(/(-?\d+)/);
        const add = match?.[1];
        if (add) {
            valueAt.set(cycle++, sum);
            valueAt.set(cycle++, sum);
            sum += +add;
            continue;
        }
        valueAt.set(cycle++, sum);
    }

    // PART 2
    let row = '';
    const crt: string[] = [];
    for (let cycle = 1; cycle <= valueAt.size; cycle++) {
        const x = cycle % 40;

        if (x > valueAt.get(cycle) + 2 || x < valueAt.get(cycle)) row += '.';
        else row += '#';

        if (x === 0) {
            crt.push(row);
            row = '';
        }
    }
    crt.push(row);

    return [
        range(0, Math.floor(valueAt.size / 40) - 1).map(v => 20 + 40 * v).map(v => v * valueAt.get(v)).reduce(add, 0),
        [...valueAt.values()].reduce((acc, v, idx) => acc + v * idx, 0), // visual output is ZFBFHGUP, using this for testing
    ];
};
