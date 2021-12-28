export default (rawInput: string) => {
    type Arrayfish = [left: Arrayfish, right: Arrayfish] | number;
    type Snailfish = {left: Snailfish, right: Snailfish;} | number;

    const toArray = (arrayFish: Arrayfish): Snailfish =>
        typeof arrayFish === 'number'
            ? arrayFish
            : {left: toArray(arrayFish[0]), right: toArray(arrayFish[1])};

    type Node = [number, number];
    const parse = (snail: Snailfish, depth: number): Node[] =>
        typeof snail === 'number'
            ? [[snail, depth]]
            :
            [
                ...parse(snail.left, depth + 1),
                ...parse(snail.right, depth + 1),
            ];

    const reduce = (nodes: Node[]): Node[] => {
        const explodeIdx = nodes.findIndex(n => n[1] > 4);
        if (explodeIdx !== -1) {
            // element to the left
            if (explodeIdx > 0) nodes.filter((_, i) => i < explodeIdx).reverse()[0][0] += nodes[explodeIdx][0];

            // element to the right
            if (explodeIdx < nodes.length - 2) nodes.find((_, i) => i > explodeIdx + 1)[0] += nodes[explodeIdx + 1][0];

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

    const add = (a: Node[], b: Node[]) => [
        ...a.map(([v, d]) => [v, d + 1] as Node),
        ...b.map(([v, d]) => [v, d + 1] as Node),
    ];

    const snailfishNumbers = rawInput.split('\n').map(line => parse(toArray(eval(line)), 0));

    const reassemble = (nodes: Node[]): Snailfish => {
        type LinkedSnailfish = {left: LinkedSnailfish, right: LinkedSnailfish, parent: Exclude<LinkedSnailfish, number>;};
        const newNode = (parent: LinkedSnailfish): LinkedSnailfish => ({left: null, right: null, parent});

        const res: LinkedSnailfish = newNode(null);
        let ptr = res;
        let currentDepth = 0;
        for (const [value, depth] of nodes) {
            while (currentDepth > 0) { // find first unset ptr.right or go back to root
                if (ptr.right == null) break;
                currentDepth--;
                ptr = ptr.parent;
            }

            if (currentDepth < depth - 1 && ptr.left != null) { // insert ptr.right if needed
                ptr.right = newNode(ptr);
                ptr = ptr.right;
                currentDepth++;
            }

            while (currentDepth < depth - 1) { // travel down ptr.left until depth = targetDepth
                currentDepth++;
                ptr.left = newNode(ptr);
                ptr = ptr.left;
            }

            if (ptr.left == null) ptr.left = value as any;
            else ptr.right = value as any;
        }

        return res;
    };

    const magnitude = (fish: Snailfish): number => typeof fish === 'number' ? fish : 3 * magnitude(fish.left) + 2 * magnitude(fish.right);

    return [
        magnitude(reassemble(snailfishNumbers.reduce((acc, n) => acc ? reduce(add(acc, n)) : n))),
        Math.max(
            ...Array.from(
                {length: snailfishNumbers.length - 1},
                (_, i) => Array.from(
                    {length: snailfishNumbers.length - 1},
                    (_, j) =>
                        i === j
                            ? []
                            : [
                                magnitude(reassemble(reduce(add(snailfishNumbers[i], snailfishNumbers[j])))),
                                magnitude(reassemble(reduce(add(snailfishNumbers[j], snailfishNumbers[i])))),
                            ]
                ),
            ).flat(2),
        ),
    ];
};
