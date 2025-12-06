export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n');
    const trimmedInput = input.map(line => line.trim().split(/\s+/));
    const operations = trimmedInput.splice(trimmedInput.length - 1)[0];

    // PART 1
    let part1 = 0;
    for (let i = 0; i < operations.length; i++) {
        const op = operations[i];
        const partial = trimmedInput.reduce((acc, v) => acc + op + v[i], op === '*' ? '1' : '0');
        part1 += eval(partial);
    }

    // PART 2
    let inputPtr = 0;
    let part2 = 0;
    for (let i = 0; i < operations.length; i++) {
        const op = operations[i];
        const operands: string[] = [];
        const boxSize = Math.max(...trimmedInput.map(row => row[i].length));
        for (let offset = boxSize - 1; offset >= 0; offset--) {
            const operand = input
                .filter((_, idx) => idx < trimmedInput.length) // dont include operand row
                .reduce((acc, v) => acc + v[inputPtr + offset], '');
            operands.push(operand);
        }
        part2 += eval(operands.join(op));
        inputPtr += (boxSize + 1);
    }

    return [
        part1, // 7098065460541
        part2, // 13807151830618
    ];
};
