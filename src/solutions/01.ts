const EXPECTED_SUM = 2020;

export default (rawInput: string) => {
    const input = rawInput.split('\n').map(v => +v);

    // PART 1
    const items = new Set(input);

    const a1 = input.find(x => items.has(EXPECTED_SUM - x));
    const b1 = EXPECTED_SUM - a1;
    console.log('Part 1:', a1 * b1);

    // PART 2
    const twoItemSums = new Set(
        input.flatMap(a =>
            input.map(b => a + b)
        )
    );

    const a2 = input.find(x => twoItemSums.has(EXPECTED_SUM - x));
    const b2 = input.find(x => twoItemSums.has(EXPECTED_SUM - a2 - x));
    const c2 = EXPECTED_SUM - a2 - b2;
    console.log('Part 2:', a2 * b2 * c2);
};
