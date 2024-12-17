export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const parse = (input: string) => {
        const [registers, program] = input.split('\n\n');

        return [
            registers.split('\n').map(line => +line.split(' ').at(-1)),
            program.split(' ').at(-1).split(',').map(Number),
        ];
    };
    const [[startA], program] = parse(rawInput);

    // forward and reverse algorithms are hand-crafted to work with the given input
    const simulate = (A: bigint) => {
        const output = [];
        while (A) {
            output.push(((A % 8n) ^ A >> (7n - (A % 8n))) % 8n);
            A >>= 3n;
        }
        return output;
    };

    const reverseProgram = [...program].reverse();
    const reverse = (idx: number, candidates: bigint[]): bigint[] =>
        idx === reverseProgram.length
            ? candidates
            : reverse(
                idx + 1,
                candidates.flatMap(
                    candidate => {
                        const start = candidate << 3n;
                        return [start, start + 1n, start + 2n, start + 3n, start + 4n, start + 5n, start + 6n, start + 7n]
                            .filter(A => Number(((A % 8n) ^ A >> ((A % 8n) ^ 7n)) % 8n) === reverseProgram[idx]);
                    }
                )
            );

    return [
        simulate(BigInt(startA)).join(','),
        reverse(1, [7n]).sort((a, b) => a > b ? 1 : -1).at(0).toString(),
    ];
};
