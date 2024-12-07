import {range} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    // PART 1
    const parse = (line: string) => {
        const [result, numbers] = line.split(': ');
        return [+result, numbers.split(' ').map(Number)] as const;
    };
    const lines = rawInput.split('\n').map(parse);

    const apply1 = (numbers: number[], n: number) => {
        const bin = n.toString(2).padStart(numbers.length - 1, '0');
        let res = numbers[0];
        for (let idx = 0; idx < numbers.length - 1; idx++) {
            if (+bin[idx]) {
                res += numbers[idx + 1];
            }
            else {
                res *= numbers[idx + 1];
            }
        }
        return res;
    };

    let part1 = 0;
    for (const [res, numbers] of lines) {
        const candidates = range(0, Math.pow(2, numbers.length - 1) - 1);
        if (candidates.some(n => apply1(numbers, n) === res)) {
            part1 += res;
        }
    }

    // PART 2

    const apply2 = (numbers: number[], n: number) => {
        const bin = n.toString(3).padStart(numbers.length - 1, '0');
        let res = numbers[0];
        for (let idx = 0; idx < numbers.length - 1; idx++) {
            switch (+bin[idx]) {
                case 0:
                    res += numbers[idx + 1];
                    break;
                case 1:
                    res *= numbers[idx + 1];
                    break;
                case 2:
                    res = +(res.toString() + numbers[idx + 1].toString());
                    break;
                default:
                    throw new Error();
            }
        }
        return res;
    };

    let part2 = 0;
    for (const [res, numbers] of lines) {
        const candidates = range(0, Math.pow(3, numbers.length - 1) - 1);
        if (candidates.some(n => apply2(numbers, n) === res)) {
            part2 += res;
        }
    }

    return [
        part1.toString(), // 6392012777720
        part2.toString(), // 61561126043536
    ];
};
