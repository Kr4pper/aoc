import {memoize} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    // PART 1
    const parse = (input: string) => {
        const [_towels, _designs] = input.split('\n\n');
        return [_towels.split(', '), _designs.split('\n')];
    };
    const [towels, designs] = parse(rawInput);

    const isPossible = memoize((design: string): boolean =>
        design.length === 0
            ? true
            : towels.filter(t => design.startsWith(t))
                .map(t => design.slice(t.length))
                .some(isPossible)
    );

    // PART 2
    const countPossible = memoize((design: string): number =>
        design.length === 0
            ? 1
            : towels.filter(t => design.startsWith(t))
                .map(t => design.slice(t.length))
                .reduce((sum, d) => sum + countPossible(d), 0)
    );

    return [
        designs.filter(isPossible).length,
        designs.map(countPossible).reduce((sum, count) => sum + count, 0),
    ];
};
