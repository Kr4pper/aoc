import {sum} from '../utils';

export default (input: string): [(number | string)?, (number | string)?] => {
    // PART 1
    const executeMUL = (instruction: string) => {
        const [_, a, b] = instruction.match(/(\d{1,3}),(\d{1,3})/);
        return +a * +b;
    };

    const parse = (input: string, ...instructions: string[]) =>
        input.match(new RegExp(instructions.join('|'), 'g'));

    const MUL = '(mul\\(\\d{1,3},\\d{1,3}\\))';

    // PART 2
    const DO = '(do\\(\\))';
    const DONT = '(don\'t\\(\\))';
    const instructions2 = parse(input, MUL, DO, DONT);

    let part2 = 0;
    let enabled = true;
    for (const instruction of instructions2) {
        if (instruction.startsWith("don't")) enabled = false;
        else if (instruction.startsWith('do')) enabled = true;
        else if (enabled) part2 += executeMUL(instruction);
    };

    return [
        sum(parse(input, MUL).map(executeMUL)),
        part2,
    ];
};
