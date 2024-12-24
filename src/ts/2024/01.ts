import {counter} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n');

    // PART 1
    const left: number[] = [];
    const right: number[] = [];

    input.forEach(line => {
        const [a, b] = line.split('   ');
        left.push(+a);
        right.push(+b);
    });

    left.sort();
    right.sort();

    // PART 2
    const leftCount = counter(left);
    const rightCount = counter(right);

    return [
        left.reduce((sum, a, idx) => sum + Math.abs(a - right[idx]), 0),
        [...leftCount.entries()].reduce((sum, [left, value]) => sum + left * value * (rightCount.get(left) || 0), 0),
    ];
};
