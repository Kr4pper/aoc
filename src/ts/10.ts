export default (rawInput: string) => {
    const lines = rawInput.split('\n').map(line => line.split(''));

    const REVERSE = {
        '(': ')',
        '[': ']',
        '{': '}',
        '<': '>',
    };
    const OPEN = Object.keys(REVERSE);
    const CLOSE = Object.values(REVERSE);

    // PART 1
    const SCORE1 = [3, 57, 1197, 25137];
    const part1 = lines.reduce((sum, line) => {
        const stack = [];
        for (const char of line) {
            if (OPEN.includes(char)) {
                stack.push(REVERSE[char]);
                continue;
            }

            if (stack.pop() !== char) return sum + SCORE1[CLOSE.indexOf(char)];
        }
        return sum;
    }, 0);

    // PART 2
    const SCORE2 = [1, 2, 3, 4];
    const res2 = lines
        .map(line => {
            const stack = [];
            for (const char of line) {
                if (OPEN.includes(char)) {
                    stack.push(REVERSE[char]);
                    continue;
                }

                if (stack.pop() !== char) return 0;
            }
            return stack.reduceRight((cum, v) => cum * 5 + SCORE2[CLOSE.indexOf(v)], 0);
        }, 0)
        .filter(v => v)
        .sort((a, b) => a - b);
    const part2 = res2[(res2.length - 1) / 2];

    return [part1, part2];
};
