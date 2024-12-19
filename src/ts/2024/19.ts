import {memoize} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const parse = (input: string) => {
        const [_towels, _designs] = input.split('\n\n');
        return [_towels.split(', '), _designs.split('\n')];
    };
    const [towels, designs] = parse(rawInput);

    const countPossible = memoize((design: string): number =>
        design.length === 0
            ? 1
            : towels.filter(t => design.startsWith(t))
                .map(t => design.slice(t.length))
                .reduce((sum, d) => sum + countPossible(d), 0)
    );

    const counts = designs.map(countPossible);
    return [
        counts.filter(v => v > 0).length,
        counts.reduce((sum, count) => sum + count, 0),
    ];
};
