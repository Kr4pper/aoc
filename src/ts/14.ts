import {Hashtable, memoizeBy} from './utils';

export default (rawInput: string) => {
    const [start, _rules] = rawInput.split('\n\n');
    const rules: Hashtable<string> = _rules.split('\n').reduce((acc, r) => {
        const [_, match, add] = r.match(/^(..) -> (.)/);
        return {...acc, [match]: add};
    }, {});

    const merge = (...items: Hashtable<number>[]): Hashtable<number> => items.reduce((acc, item) => {
        Object.entries(item).forEach(([k, v]) => acc[k] = (acc[k] || 0) + v);
        return acc;
    }, {});

    const _grow = ([start, depth]: [string, number]): Hashtable<number> => {
        const [left, right] = start;
        if (depth === 0) {
            return {
                [left]: 1,
                [right]: left === right ? 2 : 1,
            };
        }

        const growth = rules[start];
        return merge(
            grow([left + growth, depth - 1]),
            grow([growth + right, depth - 1]),
            {[growth]: -1},
        );
    };

    const grow = memoizeBy(([[left, right], depth]) => left + right + depth, _grow);
    const windows = (str: string) => Array.from({length: str.length - 1}, (_, idx) => str[idx] + str[idx + 1]);
    const solve = (start: string, depth: number) => {
        const res = windows(start).reduce(
            (acc, window, idx) => {
                const growth = rules[window];
                const duplicates = {[growth]: -1};
                if (idx > 0) duplicates[window[0]] = -1;

                return merge(
                    acc,
                    grow([window[0] + growth, depth - 1]),
                    grow([growth + window[1], depth - 1]),
                    duplicates,
                );
            },
            {} as Hashtable<number>
        );
        const sorted = Object.values(res).sort((a, b) => b - a);
        return sorted[0] - sorted[sorted.length - 1];
    };

    return [
        solve(start, 10),
        solve(start, 40),
    ];
};
