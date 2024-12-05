export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const [rawRules, rawUpdates] = rawInput.split('\n\n');

    // PART 1
    const rules = rawRules.split('\n').map(r => r.split('|').map(Number)) as [number, number][];
    const updates = rawUpdates.split('\n').map(r => r.split(',').map(Number));

    const findRuleError = (update: number[], [before, after]: [number, number]) => {
        const beforeIdx = update.indexOf(before);
        if (beforeIdx < 0) return null;

        const afterIdx = update.indexOf(after);
        if (afterIdx < 0 || beforeIdx < afterIdx) return null;

        return [beforeIdx, afterIdx] as [number, number];
    };

    const findUpdateError = (update: number[]) => {
        for (const rule of rules) {
            const error = findRuleError(update, rule);
            if (error) return error;
        }
    };

    const validateUpdates = (updates: number[][]) => {
        const validUpdates: number[][] = [];
        const invalidUpdates: [update: number[], error: [number, number]][] = [];
        for (const update of updates) {
            const error = findUpdateError(update);
            if (error) invalidUpdates.push([update, error]);
            else validUpdates.push(update);
        }

        return [validUpdates, invalidUpdates] as const;
    };

    const [validUpdates, invalidUpdates] = validateUpdates(updates);

    const middleElementSum = (updates: number[][]) => updates.reduce((sum, update) => sum + update[(update.length - 1) / 2], 0);

    // PART 2
    const fixError = (update: number[], error: [number, number]) => {
        const swap = update[error[1]];
        update[error[1]] = update[error[0]];
        update[error[0]] = swap;
    };

    const fixUpdate = ([update, error]: [number[], [number, number]]) => {
        do {
            fixError(update, error);
            error = findUpdateError(update);
        } while (error);

        return update;
    };

    return [
        middleElementSum(validUpdates),
        middleElementSum(invalidUpdates.map(fixUpdate)),
    ];
};
