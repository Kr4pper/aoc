import {descending, Hashtable, lcm, lens, multiply} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const monkeyRegex = /^Monkey (\d+):\n[^\n]*items: ([^\n]*)*\n[^=]*= ([^\n]*)\n[^\n]* by (\d+)\n[^\n]*(\d+)\n[^\n]*(\d+)/m;
    const parseMonkey = (monkey: string) => {
        const [_, id, startingItems, operation, test, truthy, falsy] = monkeyRegex.exec(monkey);

        const op = `old => ${operation}`;
        return {
            id: +id,
            items: startingItems.split(', ').map(Number),
            operation: (): (old: number) => number => eval(op),
            test: +test,
            truthy: +truthy,
            falsy: +falsy
        } as const;
    };

    const simulateMonkeys = (rounds: number, worryMultiplier: number) => {
        const parsed = rawInput.split('\n\n').map(parseMonkey);
        const modulus = parsed.map(lens('test')).map(Number).reduce(lcm, 1);

        const monkeys: Hashtable<ReturnType<typeof parseMonkey>> = {};
        const throws: Hashtable<number> = {};
        for (const monkey of parsed) {
            monkeys[monkey.id] = monkey;
            throws[monkey.id] = 0;
        }

        for (let round = 0; round < rounds; round++) {
            for (const monkey of parsed) {
                throws[monkey.id] += monkey.items.length;
                for (const item of monkey.items.splice(0)) {
                    const worry = Math.floor(monkey.operation()(item) / worryMultiplier);
                    const scaled = worry % modulus;
                    const tossTarget = scaled % monkey.test === 0 ? monkey.truthy : monkey.falsy;
                    monkeys[tossTarget].items.push(scaled);
                }
            }
        }

        return Object.values(throws).sort(descending).slice(0, 2).reduce(multiply, 1);
    };

    return [
        simulateMonkeys(20, 3),
        simulateMonkeys(10000, 1),
    ];
};
