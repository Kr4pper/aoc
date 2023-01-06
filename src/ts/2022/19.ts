export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n');

    const blueprintRegex = /(\d+)/g;
    const parseBluePrint = (line: string) => {
        const [id, orePerOre, orePerClay, orePerObsidian, clayPerObsidian, orePerGeode, obsidianPerGeode] = line.match(blueprintRegex);
        return [id, orePerOre, orePerClay, orePerObsidian, clayPerObsidian, orePerGeode, obsidianPerGeode].map(Number);
    };

    // PART 1
    const blueprints = input.map(parseBluePrint);
    let max = 0;

    const toScore = (blueprint: number[]) => {
        const [id, orePerOre, orePerClay, orePerObsidian, clayPerObsidian, orePerGeode, obsidianPerGeode] = blueprint;

        const traverse = (turn: number, resources: number[]) => {
            const [oreRobots, clayRobots, obsidianRobots, geodeRobots, ore, clay, obsidian, geode] = resources;

            console.log('turn', turn)
            if (turn === 24) {
                console.log(id, geode)
                if (geode > max) {
                    console.log('new max', id, geode, resources);
                    max = geode;
                }
                return;
            }

            let newOre = ore + oreRobots;
            let newClay = clay + clayRobots;
            let newObsidian = obsidian + obsidianRobots;
            let newGeode = geode + geodeRobots;
            // TODO: add ability to buy multiple robots per turn
            console.log(newOre, orePerOre)
            if (newOre >= orePerGeode && newObsidian >= obsidianPerGeode) {
                console.log('geode')
                traverse(turn + 1, [oreRobots, clayRobots, obsidianRobots, geodeRobots + 1, newOre - orePerGeode, newClay, newObsidian - obsidianPerGeode, newGeode]);
            }
            else if (newOre >= orePerObsidian && newClay >= clayPerObsidian) {
                console.log('obsidian')
                traverse(turn + 1, [oreRobots, clayRobots, obsidianRobots + 1, geodeRobots, newOre - orePerObsidian, newClay - clayPerObsidian, newObsidian, newGeode]);
            }
            else if (newOre >= orePerClay) {
                console.log('clay')
                traverse(turn + 1, [oreRobots, clayRobots + 1, obsidianRobots, geodeRobots, newOre - orePerClay, newClay, newObsidian, newGeode]);
            }
            else if (newOre >= orePerOre) {
                console.log('ore')
                traverse(turn + 1, [oreRobots + 1, clayRobots, obsidianRobots, geodeRobots, newOre - orePerOre, newClay, newObsidian, newGeode]);
            }
            else traverse(turn + 1, [oreRobots, clayRobots, obsidianRobots, geodeRobots, newOre, newClay, newObsidian, newGeode]);
        };

        traverse(0, [1, 0, 0, 0, 0, 0, 0, 0]);
    };

    const scores = blueprints.map(toScore);

    // PART 2

    return [];
};
