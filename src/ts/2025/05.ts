export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const parseInput = (rawInput: string) => {
        const [ranges, ingredients] = rawInput.split('\n\n');
        return [
            ranges.split('\n').map(r => r.split('-').map(Number)),
            ingredients.split('\n').map(Number),
        ] as const;
    };
    const [ranges, ingredients] = parseInput(rawInput);

    const processed: [number, number][] = [];
    ranges.sort(([low1], [low2]) => low1 > low2 ? 1 : -1);
    for (const [low, high] of ranges) {
        const collisionIdx = processed.findIndex(([otherLow, otherHigh]) => low <= otherHigh && high >= otherLow);
        if (collisionIdx > -1) {
            const [otherLow, otherHigh] = processed[collisionIdx];
            processed[collisionIdx] = [
                Math.min(low, otherLow),
                Math.max(high, otherHigh),
            ];
        }
        else processed.push([low, high]);
    }

    return [
        ingredients.filter(i => ranges.find(([low, high]) => i >= low && i <= high)).length, // 652
        processed.reduce((sum, [low, high]) => sum + (high - low + 1), 0), // 341753674214273
    ];
};
