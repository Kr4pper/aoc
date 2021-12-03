import {strToBin} from '../utils';

export default (rawInput: string) => {
    const input = rawInput.split('\n');

    // PART 1
    const inputLength = input.length;
    const numBits = input[0].length;
    const bitCounts = input.reduce((acc, binString) => {
        binString.split('').map(Number).forEach((bit, idx) => acc[idx] = (acc[idx] || 0) + bit);
        return acc;
    }, {});
    const mostCommonBits = Object.entries(bitCounts).filter(([_, v]) => v > inputLength / 2);
    const gamma = mostCommonBits.reduce((acc, [k]) => acc + Math.pow(2, numBits - +k - 1), 0);
    const epsilon = Math.pow(2, numBits) - gamma - 1;
    console.log('Part 1:', gamma * epsilon);

    // PART 2
    const recursiveOxygen = recursiveFilter(input, (zeroPercent, idx) => item => zeroPercent <= 0.5 === (item[idx] === '1'));
    const recursiveCo2 = recursiveFilter(input, (zeroPercent, idx) => item => zeroPercent > 0.5 === (item[idx] === '1'));

    console.log('Part 2:', strToBin(recursiveOxygen) * strToBin(recursiveCo2));
};

const recursiveFilter = (
    items: string[],
    predicate: (zeroPercent: number, idx: number) => (item: string) => boolean,
    idx = 0,
): string => {
    if (items.length === 0) throw new Error('No items remaining');
    if (items.length === 1) return items[0];

    const zeroPercent = items.filter(v => v[idx] === '0').length / items.length;
    return recursiveFilter(items.filter(predicate(zeroPercent, idx)), predicate, idx + 1);
};
