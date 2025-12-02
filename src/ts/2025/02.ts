export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n')[0].split(',');
    const pairs = input.map(pair => pair.split('-').map(Number));

    /**
     * alternative approach:
     * build prefixes based on the lower number and only check if those feasible values are in the range
     * for example with a start of 6 digits check ABABAB and ABCABC
     */

    const twoParts = /^(\d+)\1$/;
    const nParts = /^(\d+)\1+$/;
    let part1 = 0;
    let part2 = 0;
    for (const [low, high] of pairs) {
        for (let i = low; i <= high; i++) {
            const asStr = i.toString();
            if (asStr.match(twoParts)) {
                part1 += i;
            }

            if (asStr.match(nParts)) {
                part2 += i;
            }
        }
    }

    return [
        part1, // 19605500130
        part2, // 36862281418
    ];
};
