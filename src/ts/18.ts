export default (rawInput: string) => {
    type Arrayfish = [left: Arrayfish, right: Arrayfish] | number;
    type Snailfish = { left: Snailfish, right: Snailfish; } | number;

    const toArray = (arrayFish: Arrayfish): Snailfish => {
        if (typeof arrayFish === 'number') return arrayFish;
        return { left: toArray(arrayFish[0]), right: toArray(arrayFish[1]) };
    };

    type Node = [number, number];
    const parse = (snail: Snailfish, depth: number): Node[] => {
        if (typeof snail === 'number') {
            return [[snail, depth]];
        }

        return [
            ...parse(snail.left, depth + 1),
            ...parse(snail.right, depth + 1),
        ];
    };

    const reduce = (nodes: Node[]): Node[] => {
        const explodeIdx = nodes.findIndex(n => n[1] > 4);
        if (explodeIdx !== -1) {
            if (explodeIdx > 0) { // element to the left
                const addNode = nodes.filter((_, i) => i < explodeIdx).reverse()[0];
                addNode[0] += nodes[explodeIdx][0];
            }

            if (explodeIdx < nodes.length - 2) { // element to the right
                const addNode = nodes.filter((_, i) => i > explodeIdx + 1)[0];
                addNode[0] += nodes[explodeIdx + 1][0];
            }

            nodes.splice(explodeIdx, 2, [0, nodes[explodeIdx][1] - 1] as Node);
            return reduce(nodes);
        }

        const splitIdx = nodes.findIndex(n => n[0] >= 10);
        if (splitIdx !== -1) {
            const [value, depth] = nodes[splitIdx];
            nodes.splice(splitIdx, 1, [Math.floor(value / 2), depth + 1], [Math.ceil(value / 2), depth + 1]);
            return reduce(nodes);
        }

        return nodes;
    };

    const add = (a: Node[], b: Node[]): Node[] => [
        ...a.map(([v, d]) => [v, d + 1] as Node),
        ...b.map(([v, d]) => [v, d + 1] as Node),
    ];

    let res: Node[];
    for (const line of rawInput.split('\n')) {
        const nodes = parse(toArray(eval(line)), 0);

        res = reduce(
            res
                ? add(res, nodes)
                : nodes,
        );
    }
    console.log('>> res', res);

    const magnitude = (fish: Snailfish): number => {
        if (typeof fish === 'number') return fish;

        return 3 * magnitude(fish.left) + 2 * magnitude(fish.right);
    };

    console.log('>> mag', toArray(res as any), magnitude(toArray(res as any)));


    // PART 2

    return [
        1,
    ];
};
