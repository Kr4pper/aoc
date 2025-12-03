export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n');
    const powerBanks = input.map(line => line.split('').map(Number));

    // PART 1
    const recursiveJoltage = (acc: number, powerBank: number[], remaining: number): number => {
        if (remaining === 0) return acc;

        for (let candidate = 9; candidate >= 0; candidate--) {
            const candidatePosition = powerBank.findIndex(v => v === candidate);
            if (candidatePosition === -1 || candidatePosition + remaining > powerBank.length) continue;

            return recursiveJoltage(acc + candidate * Math.pow(10, remaining - 1), powerBank.filter((_, idx) => idx > candidatePosition), remaining - 1);
        }
    };

    return [
        powerBanks.reduce((sum, v) => sum + recursiveJoltage(0, v, 2), 0), // 17244
        powerBanks.reduce((sum, v) => sum + recursiveJoltage(0, v, 12), 0), // 171435596092638
    ];
};
