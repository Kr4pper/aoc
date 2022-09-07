export default (rawInput: string) => {
    type Dot = [number, number];
    type Fold = ['x' | 'y', number];

    const parseInput = (rawInput: string): [Dot[], Fold[]] => {
        const [dots, fold] = rawInput.split('\n\n').map(v => v.split('\n'));

        return [
            dots.map(d => d.split(',').map(Number) as Dot),
            fold.map(f => {
                const [_, type, value] = f.match(/(y|x)=(\d+)$/);
                return [type as 'x' | 'y', +value];
            }),
        ];
    };

    const applyFold = (dots: Dot[], [type, value]: Fold): Dot[] => {
        const next = new Set<string>();
        switch (type) {
            case 'x':
                for (const [x, y] of dots) {
                    if (x < value) next.add(`${x},${y}`);
                    else next.add(`${2 * value - x},${y}`);
                }
                break;
            case 'y':
                for (const [x, y] of dots) {
                    if (y < value) next.add(`${x},${y}`);
                    else next.add(`${x},${2 * value - y}`);
                }
                break;
            default:
                throw new Error();
        }
        return [...next].map(v => v.split(',').map(Number) as Dot);
    };

    const [dots, folds] = parseInput(rawInput);
    const foldedSet = new Set(folds.reduce(applyFold, dots).map(([x, y]) => `${x},${y}`));

    return [
        applyFold(dots, folds[0]).length,
        foldedSet.size, // real problem requires image recognition, using this instead for tests
    ];
};
