export default (rawInput: string): [(number | string)?, (number | string)?] => {

    type Packet = Item[];
    type Item = number | Item[];

    const compare = (left: Packet, right: Packet): boolean | undefined => {
        for (let i = 0; i < left.length; i++) {
            if (i > right.length - 1) return false;

            const a = left[i];
            const b = right[i];
            const leftIsInt = typeof a === 'number';
            const rightIsInt = typeof b === 'number';
            if (leftIsInt && rightIsInt) {
                if (a < b) return true;
                if (a > b) return false;
                continue; // a === b
            }

            const aList = leftIsInt ? [a] : a;
            const bList = rightIsInt ? [b] : b;
            const inner = compare(aList, bList);
            if (inner !== undefined) return inner;
        }
        if (left.length < right.length) return true;
        // both lengths being equal will implicitly continue searching
    };

    // PART 1
    let rightOrderIndiceSum = 0;
    const allPackets: Packet[] = [];
    const chunks = rawInput.split('\n\n');
    for (let c = 0; c < chunks.length; c++) {
        const [left, right] = chunks[c].split('\n').map(eval) as Packet[];
        allPackets.push(left, right);

        if (compare(left, right)) rightOrderIndiceSum += c + 1;
    }

    // PART 2
    allPackets.push([[2]], [[6]]);
    const sorted = allPackets.sort((a, b) => compare(a, b) ? -1 : 1).map(p => JSON.stringify(p));
    const dividerIdx = (divider: number) => sorted.findIndex(p => p === `[[${divider}]]`) + 1;

    return [
        rightOrderIndiceSum,
        dividerIdx(2) * dividerIdx(6),
    ];
};
