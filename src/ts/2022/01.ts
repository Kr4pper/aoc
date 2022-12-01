export default (rawInput: string): [number?, number?] => {
    const chunks = rawInput.split('\n\n');

    const elves =
        chunks
            .map(c => c.split('\n').reduce((acc, calories) => acc + +calories, 0))
            .sort((a, b) => b > a ? 1 : -1);

    return [
        elves[0],
        elves[0] + elves[1] + elves[2],
    ];
};
