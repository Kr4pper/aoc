export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const [rawRules, rawUpdates] = rawInput.split('\n\n');

    // PART 1
    const rules = rawRules.split('\n').map(r => r.split('|').map(Number));
    const updates = rawUpdates.split('\n').map(r => r.split(',').map(Number));

    const ruleValidation = (update: number[]) => ([before, after]: [number, number]): [valid: boolean, error?: [number, number]] => {
        const beforeIdx = update.indexOf(before);
        const afterIdx = update.indexOf(after);
        if (beforeIdx < 0 || afterIdx < 0 || beforeIdx < afterIdx) return [true];

        return [false, [beforeIdx, afterIdx]];
    };

    const validate = (update: number[]) => {
        const errors: [number, number][] = [];
        for (const [valid, error] of rules.map(ruleValidation(update))) {
            if (!valid) errors.push(error);
        }
        return errors;
    };

    const validateAll = (updates: number[][]) => {
        const validUpdates: number[][] = [];
        const invalidUpdates: [update: number[], errors: [number, number][]][] = [];
        for (const update of updates) {
            const errors = validate(update);

            if (errors.length > 0) invalidUpdates.push([update, errors]);
            else validUpdates.push(update);
        }

        return [validUpdates, invalidUpdates] as const;
    };

    const [validPart1, invalidPart1] = validateAll(updates);

    // PART 2
    const fixError = (update: number[], error: [number, number]) => {
        const swap = update[error[1]];
        update[error[1]] = update[error[0]];
        update[error[0]] = swap;
    };

    let part2 = 0;
    for (let [update, errors] of invalidPart1) {
        do {
            fixError(update, errors[0]);
            errors = validate(update);
        } while (errors.length);

        part2 += update[(update.length - 1) / 2];
    }
    

    return [
        validPart1.reduce((sum, update) => sum + update[(update.length - 1) / 2], 0),
        part2,
    ];
};
