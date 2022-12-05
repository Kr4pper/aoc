import {combinations, counter} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const ids = rawInput.split('\n');

    // PART 1
    const part1 = (histograms: ReturnType<typeof counter>[]) =>
        histograms.filter(h => [...h.values()].some(v => v === 2)).length *
        histograms.filter(h => [...h.values()].some(v => v === 3)).length;

    // PART 2
    const findDifferingIdx = (first: string, second: string) => {
        let mismatches = 0;
        let differingIdx: number;
        second.split('').forEach((v, idx) => {
            if (v !== first[idx]) {
                differingIdx = idx;
                if (++mismatches > 1) return;
            }
        });
        return differingIdx;
    };

    const part2 = (ids: string[]) => {
        for (const [first, second] of combinations(ids, ids)) {
            const differingIdx = findDifferingIdx(first, second);
            if (differingIdx) return [...first].filter((_, idx) => idx !== differingIdx).join('');
        }
    };

    return [
        part1(ids.map(counter)),
        part2(ids),
    ];
};
