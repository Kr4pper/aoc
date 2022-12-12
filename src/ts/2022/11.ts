import {Hashtable, lcm} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const parseMonkey = (monkey: string) => {
        const match = /^Monkey (\d+):\n[^\n]*items: ([^\n]*)*\n[^=]*= ([^\n]*)\n[^\n]* by (\d+)\n[^\n]*(\d+)\n[^\n]*(\d+)/m.exec(monkey);
        const [_, id, startingItems, operation, test, truthy, falsy] = match;

        const bigIntified = operation.replaceAll(/(\d+)/g, '$1n');

        return {
            id: +id,
            items: startingItems.split(', ').map(v => [v, BigInt(v)] as const),
            operation: (): (old: bigint) => bigint => eval(`old => ${bigIntified}`),
            test: BigInt(test),
            truthy: +truthy,
            falsy: +falsy
        } as const;
    };

    // PART 1
    const simulate = (rounds: number, worryMultiplier: bigint) => {
        const parsed = rawInput.split('\n\n').map(parseMonkey);
        const modulus = BigInt(parsed.map(p => Number(p.test)).reduce(lcm, 1));

        const monkeys: Hashtable<ReturnType<typeof parseMonkey>> = {};
        for (const monkey of parsed) {
            monkeys[monkey.id] = monkey;
        }
        const throws: Hashtable<number> = Object.values(monkeys).reduce((acc, m) => ({...acc, [m.id]: 0}), {});

        for (let round = 0; round < rounds; round++) {
            for (const monkey of parsed) {
                throws[monkey.id] += monkey.items.length;
                for (const [itemId, item] of monkey.items.splice(0)) {
                    const newItem = monkey.operation()(item);
                    const newWorry = newItem / worryMultiplier;
                    const scaled = newWorry % modulus;
                    const target = scaled % monkey.test === 0n ? monkey.truthy : monkey.falsy;
                    monkeys[target].items.push([itemId, scaled]);
                }
            }
        }

        const sortedThrows = Object.values(throws).sort((a, b) => a < b ? 1 : -1);
        return sortedThrows[0] * sortedThrows[1];
    };

    return [
        simulate(20, 3n),
        simulate(10000, 1n),
    ];
};
