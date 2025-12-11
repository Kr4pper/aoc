export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n');
    const parseMachine = (line: string) => {
        const [_, required, buttons, joltage] = /\[(.+)\] (.+) {(.+)}/.exec(line);

        return [
            required.split('').reduce((acc, char, idx) => acc + (char === '#' ? 1 << idx : 0), 0),
            buttons.split(' ').map(button => button.substring(1, button.length - 1).split(',').map(Number).reduce((acc, char) => acc + (1 << char), 0)),
            joltage.split(',').map(Number),
        ] as const;
    };
    const machines = input.map(parseMachine);

    // PART 1
    type Machine = ReturnType<typeof parseMachine>;
    const getOptimizedIndicators = ([goal, buttons]: Machine): number => {
        const options: number[][] = [];
        for (let i = 0; i < Math.pow(2, buttons.length); i++) {
            const option: number[] = [];
            for (let j = 0; j < buttons.length; j++) {
                if ((i & (1 << j)) !== 0) option.push(buttons[j]);
            }
            options.push(option);
        }

        const applied = options.map(buttons => [buttons.reduce((acc, button) => acc ^ button, goal), buttons.length]);

        return Math.min(...applied.filter(([final]) => final === 0).map(([_, steps]) => steps));
    };

    // PART 2
    /*
    const visited = new Map<number, number>(); // state -> depth
    const a = (depth: number = 0, tail: number[] = [machine[0]]): number => {
        //console.log({depth, acc});

        const state = tail.reduce((acc, v) => acc ^ v);
        const seen = visited.get(state);
        if (seen) {
            if (seen > depth) visited.set(state, depth);
            if (seen < depth) return Number.POSITIVE_INFINITY;
        }

        if (depth > 5) return Number.POSITIVE_INFINITY;
        //if (acc === 0) return depth;

        const next = machine[1].map(button => a(depth + 1, [...tail, button]));
        if (next.some(v => v === 0)) return depth + 1;

        return Math.min(...next.map(v => a(depth + 1, [...tail, v])));
    };
    */

    const part2 = ([_, buttons, joltage]: Machine): number => {
        /**
         * one variable per button (b_1, ..., b_n)
         * relevant buttons must add up to joltages
         */

        for (let i = 0; i < joltage.length; i++) {
            const entry = joltage[i];

            const relatedButtons = buttons
                .map((b, idx) => [b, idx])
                .filter(([b]) => (b & (1 << i)) !== 0)
                .map(([_, idx]) => idx);
            console.log({i, entry, relatedButtons, a: 1 << i});
        }

        return 0;
    };


    return [
        machines.reduce((sum, m) => sum + getOptimizedIndicators(m), 0), // 500
    ];
};
