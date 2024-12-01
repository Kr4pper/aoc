export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const [seedsString, ...blocks] = rawInput.split('\n\n');

    // PART 1
    const blockToTranslation = (block: string): [start: number, end: number, shift: number][] => {
        const [description, ...rules] = block.split('\n');

        const translation = [];
        for (const ruleString of rules) {
            const [destinationStart, sourceStart, rangeLength] = ruleString.split(' ').map(Number);
            translation.push([sourceStart, sourceStart + rangeLength - 1, destinationStart - sourceStart] as [number, number, number]);
        }
        return translation;
    };

    const translations = blocks.map(blockToTranslation);

    const getSeedLocation = (seed: number): number => {
        let value = seed;
        for (const translation of translations) {
            for (const [start, end, shift] of translation) {
                if (value < start || value > end) continue;

                value = value + shift;
                break;
            }
        }
        return value;
    };

    const [_, ...part1Seeds] = seedsString.split('seeds: ').flatMap(v => v.split(' ').map(Number));
    const part1Locations = part1Seeds.map(getSeedLocation);

    // PART 2
    const [__, ...part2SeedsRaw] = seedsString.split('seeds: ').flatMap(v => v.split(' ').map(Number));
    let min = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < part2SeedsRaw.length / 2; i++) {
        const start = part2SeedsRaw[2 * i];
        const length = part2SeedsRaw[2 * i + 1];
        for (let offset = 0; offset < length; offset++) {
            const location = getSeedLocation(start + offset);
            if (location < min) {
                console.log('new min', location);
                min = location;
            }
        }
    }

    //const part2Locations = part2Seeds.map(getSeedLocation);


    return [
        Math.min(...part1Locations),
        //Math.min(...part2Locations),
        min,
    ];
};
