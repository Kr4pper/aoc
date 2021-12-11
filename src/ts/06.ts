import {memoize} from './utils';

export default (rawInput: string) => {
    const input = rawInput.split(',').map(Number);

    // assumes that every newly created lanternfish is a "0"
    const fromTimer = memoize(
        (remainingDays: number, totalFishes = 0) =>
            remainingDays < 0
                ? 1 // negative fish will not breed in time and thus have a weight of 1
                : totalFishes + fromTimer(remainingDays - 7) + fromTimer(remainingDays - 9)
    );

    const numeric = (fishes: number[], days: number) => fishes.reduce((sum, fish) => sum + fromTimer(days - fish - 1), 0);

    return [
        numeric(input, 80),
        numeric(input, 256),
    ];
};
