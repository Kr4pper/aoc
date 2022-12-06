export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('');

    const idxOfFirstUniqueRun = (
        list: string[],
        runLength: number,
        notBefore = 0,
    ) => {
        const start = Math.max(0, notBefore - runLength);
        const window = list.slice(start, start + runLength);
        for (let idx = start; true; idx++) {
            if (new Set(window).size === runLength) return idx;

            window.splice(0, 1);
            window.push(list[idx]);
        }
    };

    const part1 = idxOfFirstUniqueRun(input, 4);
    const part2 = idxOfFirstUniqueRun(input, 14, part1); // run of 14 cant start before run of 14

    return [
        part1,
        part2,
    ];
};
