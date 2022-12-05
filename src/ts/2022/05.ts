import {range} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    type Container = string[];
    type Step = [amount: number, from: number, to: number];

    const parseContainers = (lines: string[]): Container[] => {
        const numberOfColumns = (lines[0].length + 1) / 4;
        const containers = range(0, numberOfColumns - 1).map<string[]>(() => []);

        for (let row = 0; row <= lines.length - 2; row++) {
            for (let column = 0; column < numberOfColumns; column++) {
                const container = lines[row][column * 4 + 1];
                if (container !== ' ') containers[column].push(container);
            }
        }

        return containers;
    };

    const parseStep = (step: string): Step => {
        const match = step.match(/move (\d+) from (\d+) to (\d+)/);
        return [match[1], match[2], match[3]].map(a => parseInt(a)) as Step;
    };

    const parseInput = (input: string) => {
        const [_containers, _steps] = input.split('\n\n');
        return [
            parseContainers(_containers.split('\n')),
            _steps.split('\n').map(parseStep)
        ] as const;
    };

    const [containers, steps] = parseInput(rawInput);

    const part1 = (containers: Container[], steps: Step[]) => {
        for (const [amount, from, to] of steps) {
            for (let i = 0; i < amount; i++) {
                containers[to - 1].unshift(containers[from - 1].shift());
            }
        }
        return containers;
    };

    const part2 = (containers: Container[], steps: Step[]) => {
        for (const [amount, from, to] of steps) {
            containers[to - 1].unshift(...containers[from - 1].splice(0, amount));
        }
        return containers;
    };

    const extractResult = (containers: Container[]) => containers.reduce((acc, c) => acc + c[0], '');

    return [
        extractResult(part1(JSON.parse(JSON.stringify(containers)), steps)),
        extractResult(part2(JSON.parse(JSON.stringify(containers)), steps)),
    ];
};
