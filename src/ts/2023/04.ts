export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const scratchcards = rawInput.split('\n');

    // PART 1
    const getMatches = (line: string) => {
        const [_, winning, actual] = line.match(/Card *\d+: (.*) \| (.*)/);
        const winningNumbers = new Set([...winning.trim().matchAll(/(\d+)/g)].map(v => v[0]).map(Number));
        const actualNumbers = new Set([...actual.trim().matchAll(/(\d+)/g)].map(v => v[0]).map(Number));
        return [...actualNumbers].filter(v => winningNumbers.has(v)).length;
    };
    const matchesByCard = scratchcards.map(getMatches);
    const part1 = matchesByCard.reduce((sum, matches) => sum + (matches === 0 ? 0 : Math.pow(2, matches - 1)), 0);

    // PART 2
    const MAX = scratchcards.length;
    const tickets = Array.from({length: MAX}, () => 1);
    let part2 = 0;
    for (let i = 0; i < MAX; i++) {
        part2 += tickets[i];
        for (let j = i + 1; j < i + 1 + matchesByCard[i]; j++) {
            tickets[j] += tickets[i];
        }
    }

    return [
        part1,
        part2,
    ];
};
