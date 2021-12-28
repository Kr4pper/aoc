import {complement, intersection, setsEqual} from '../utils';

export default (rawInput: string) => {
    const entries = rawInput
        .split('\n')
        .map(line => line.split('|').map(v => v.trim().split(' ')))
        .map(([input, output]) => [
            input.map(i => new Set(i)).sort((a, b) => a.size - b.size),
            output.map(o => new Set(o)),
        ]);

    const decode = ([input, output]: Set<string>[][]): number => {
        const deduce = (display: number, pred: (value: Set<string>, idx: number) => boolean) => {
            const idx = input.findIndex(pred);
            table[display] = input[idx];
            picked.add(idx);
            return idx;
        };

        const table = new Array(10);
        const picked = new Set<number>();

        deduce(1, v => v.size === 2);
        deduce(7, v => v.size === 3);
        deduce(4, v => v.size === 4);
        deduce(8, v => v.size === 7);
        deduce(3, v => v.size === 5 && intersection(v, table[1]).size === 2);
        deduce(5, (v, idx) => !picked.has(idx) && v.size === 5 && intersection(v, table[4]).size === 3);
        deduce(2, (v, idx) => !picked.has(idx) && v.size === 5);
        deduce(6, v => v.size === 6 && complement(v, table[1]).size === 5);
        deduce(9, v => v.size === 6 && complement(v, table[4]).size === 2);
        deduce(0, (_, idx) => !picked.has(idx));

        return output
            .map(o => table.findIndex(v => setsEqual(o, v)))
            .reverse()
            .reduce((sum, v, idx) => sum + v * Math.pow(10, idx), 0);
    };

    const distinctLengths = [2, 3, 4, 7];

    return [
        entries.reduce((sum, [_, output]) => sum + output.filter(v => distinctLengths.includes(v.size)).length, 0),
        entries.reduce((sum, entry) => sum + decode(entry), 0),
    ];
};
