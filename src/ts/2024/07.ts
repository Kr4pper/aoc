export default (rawInput: string): [(number | string)?, (number | string)?] => {
    type Line = [
        value: number,
        nums: number[],
    ];
    const parseLine = (line: string): Line => {
        const [result, numbers] = line.split(': ');
        return [+result, numbers.split(' ').map(Number)];
    };
    const lines = rawInput.split('\n').map(parseLine);

    const isValid = ([value, numbers]: Line, concatEnabled: boolean) => {
        if (numbers.length === 2) {
            return (
                numbers[0] + numbers[1] === value ||
                numbers[0] * numbers[1] === value ||
                (concatEnabled && +numbers.join('') === value)
            );
        }

        const tail = numbers.at(-1);
        const front = numbers.slice(0, -1);

        const sumTarget = value - tail;
        if (sumTarget > 0 && isValid([sumTarget, front], concatEnabled)) {
            return true;
        }

        const multiplyTarget = value / tail;
        if (
            multiplyTarget === Math.floor(multiplyTarget) &&
            isValid([multiplyTarget, front], concatEnabled)
        ) {
            return true;
        }

        if (concatEnabled && String(value).endsWith(String(tail))) {
            const concatTarget = Number(String(value).slice(0, -String(tail).length));
            if (isValid([concatTarget, front], concatEnabled)) {
                return true;
            }
        }

        return false;
    };

    const calibrationResult = (lines: Line[], concatEnabled: boolean) =>
        lines
            .filter(line => isValid(line, concatEnabled))
            .reduce((sum, [value]) => sum + value, 0);

    return [
        calibrationResult(lines, false),
        calibrationResult(lines, true),
    ];
};
