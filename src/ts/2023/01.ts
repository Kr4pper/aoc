export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n');

    // PART 1
    const PART1 = /\d/g;
    const calibration1 = input.reduce((res, line) => {
        const numbers = line.match(PART1);
        return res
            + +(numbers[0] + numbers[numbers.length - 1]);
    }, 0);

    // PART 2
    const PART2 = /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g;
    const TRANSLATION: Record<string, string> = {
        'one': '1',
        'two': '2',
        'three': '3',
        'four': '4',
        'five': '5',
        'six': '6',
        'seven': '7',
        'eight': '8',
        'nine': '9',
    };
    const translate = (value: string) =>
        value in TRANSLATION
            ? TRANSLATION[value]
            : value;
    const calibration2 = input.reduce((res, line) => {
        const numbers = Array.from(line.matchAll(PART2), m => m[1]);
        return res + +(translate(numbers[0]) + translate(numbers[numbers.length - 1]));
    }, 0);

    return [
        calibration1,
        calibration2, // 9965 low
    ];
};
