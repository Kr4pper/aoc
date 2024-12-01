import {Hashtable} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n');

    // PART 1
    const left: number[] = [];
    const right: number[] = [];

    input.forEach(line => {
        const [_, a, b] = line.match(/(\d+)\s+(\d+)/);
        left.push(+a);
        right.push(+b);
    });

    left.sort();
    right.sort();

    const part1 = left.reduce((sum, a, idx) => sum + Math.abs(a - right[idx]), 0);

    // PART 2
    const rightCount = right.reduce((res, v) => ({
        ...res,
        [String(v)]: (res[String(v)] || 0) + 1,
    }), {} as Hashtable<number>);
    const part2 = left.reduce((sum, a) => sum + (a * rightCount[String(a)] || 0), 0);

    return [
        part1, // 1197984
        part2, // 23387399
    ];
};
