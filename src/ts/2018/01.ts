export default (rawInput: string): [(number | string)?, (number | string)?] => {
    // PART 1
    const parseLine = (line: string) => {
        const mod = line[0] === '+' ? 1 : -1;
        return mod * parseInt(line.substring(1));
    };

    const values = rawInput.split('\n').map(parseLine);

    const part1 = (values: number[]) => values.reduce((acc, value) => acc + value, 0);

    // +86040
    // -85466
    // =  574

    // PART 2
    const part2 = (lines: number[]) => {
        const seen = new Set<number>();
        let frequency = 0;
        while (true) {
            for (const value of lines) {
                frequency += value;
                if (seen.has(frequency)) return frequency;
                seen.add(frequency);
            }
        }
    };

    return [
        part1(values),
        part2(values),
    ];
};
