export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n');
    const reports = input.map(line => line.split(' ').map(Number));

    // PART 1
    const getDiffs = (numbers: number[]) => numbers
        .filter((_, idx) => idx < numbers.length - 1)
        .flatMap((n, idx) => numbers[idx + 1] - n);

    const isSafe1 = (levels: number[]) => {
        const diffs = getDiffs(levels);
        const min = Math.min(...diffs);
        const max = Math.max(...diffs);
        if (min < 0 && max > 0) return false;

        return diffs.every(d => d !== 0 && Math.abs(d) <= 3);
    };

    const countTrue = (arr: boolean[]) => arr.reduce((sum, v) => sum + +v, 0);

    // PART 2
    const withoutLevelAt = (levels: number[], idx: number) => {
        const candidate = [...levels];
        candidate.splice(idx, 1);
        return candidate;
    };

    const isSafe2 = (levels: number[]) => levels.some((_, idx) => isSafe1(withoutLevelAt(levels, idx)));

    return [
        countTrue(reports.map(isSafe1)),
        countTrue(reports.map(isSafe2)),
    ];
};
