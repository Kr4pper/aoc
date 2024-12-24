import {Hashtable} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const parse = (input: string) => {
        const [_initial, _gates] = input.split('\n\n').map(block => block.split('\n'));

        const parseInitial = (initial: string) => {
            const [id, value] = initial.split(': ');
            return [id, Number(value)] as const;
        };

        const parseGate = (gate: string) => {
            const [in1, op, in2, _, out] = gate.split(' ');
            return [in1, op as 'AND' | 'OR' | 'XOR', in2, out] as const;
        };
        return [
            _initial.map(parseInitial),
            _gates.map(parseGate),
        ] as const;
    };

    const [initial, gates] = parse(rawInput);

    // PART 1
    const values: Hashtable<number> = {};
    for (const [id, value] of initial) {
        values[id] = value;
    }

    type ExecuteOp = (in1: number, in2: number) => number;
    const operations: Hashtable<ExecuteOp> = {
        'AND': (in1, in2) => in1 && in2,
        'OR': (in1, in2) => in1 || in2,
        'XOR': (in1, in2) => in1 ^ in2,
    };

    while (gates.length) {
        gates.forEach(([in1, op, in2, out], idx) => {
            if (Object.hasOwn(values, in1) && Object.hasOwn(values, in2)) {
                values[out] = operations[op](values[in1], values[in2]);
                gates.splice(idx, 1);
            }
        });
    }

    // PART 2

    return [
        Object.entries(values)
            .filter(([id]) => id[0] === 'z')
            .map(([id, value]) => [+id.substring(1), value])
            .sort(([id1], [id2]) => id1 - id2)
            .reduce((sum, [_, v], idx) => sum + (BigInt(v) << BigInt(idx)), 0n).toString(), // 57632654722854
    ];
};
