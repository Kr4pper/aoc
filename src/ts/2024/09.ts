export default (rawInput: string): [(number | string)?, (number | string)?] => {
    // PART 1
    type Pointer = [memoryIdx: number, width: number];
    type Allocation = [memoryIdx: number, fileIdx: number, width: number];

    const parse = (input: string): [Pointer[], Pointer[]] => {
        const files: Pointer[] = [];
        const spaces: Pointer[] = [];
        let memoryIdx = 0;
        input.split('').forEach((v, idx) => {
            (idx % 2 === 0 ? files : spaces).push([memoryIdx, +v]);
            memoryIdx += +v;
        });
        return [files, spaces];
    };
    let [files, spaces] = parse(rawInput);

    const part1Files = [...files];
    const allocations1: Allocation[] = [];
    let frontFileIdx = 0;
    let memoryIdx = 0;
    for (let [_, spaceWidth] of spaces) {
        if (part1Files.length) {
            const [_, existingFile] = part1Files.splice(0, 1)[0];
            allocations1.push([memoryIdx, frontFileIdx, existingFile]);
            memoryIdx += existingFile;
            frontFileIdx++;
        }

        while (spaceWidth > 0) {
            if (!part1Files.length) break;

            const fileIdx = part1Files.length - 1;
            const [_, fileWidth] = part1Files.splice(fileIdx, 1)[0];
            const allocateWidth = Math.min(spaceWidth, fileWidth);
            allocations1.push([memoryIdx, fileIdx + frontFileIdx, allocateWidth]);
            if (allocateWidth < fileWidth) {
                part1Files.push([undefined, fileWidth - spaceWidth]);
            }

            memoryIdx += allocateWidth;
            spaceWidth -= allocateWidth;
        }
    }

    const triangle = (n: number) => n * (n + 1) / 2;

    const checksum = (allocations: Allocation[]) => allocations.reduce((sum, [memoryIdx, fileIdx, width]) => sum + fileIdx * (triangle(memoryIdx + width - 1) - triangle(memoryIdx - 1)), 0);

    // PART 2
    const allocations2: [memoryIdx: number, fileIdx: number, width: number][] = [];
    for (let fileIdx = files.length - 1; fileIdx >= 0; fileIdx--) {
        const [fileMemoryIdx, fileWidth] = files[fileIdx];

        let reallocated = false;
        for (let spaceIdx = 0; spaceIdx < spaces.length; spaceIdx++) {
            const [spaceMemoryIdx, spaceWidth] = spaces[spaceIdx];
            if (spaceMemoryIdx > fileMemoryIdx) continue;

            if (fileWidth <= spaceWidth) {
                allocations2.push([spaceMemoryIdx, fileIdx, fileWidth]);
                reallocated = true;

                if (spaceWidth === fileWidth) {
                    spaces.splice(spaceIdx, 1);
                } else {
                    spaces[spaceIdx] = [spaceMemoryIdx + fileWidth, spaceWidth - fileWidth];
                }

                break;
            }
        }
        if (!reallocated) {
            allocations2.push([fileMemoryIdx, fileIdx, fileWidth]);
        }
    }

    return [
        checksum(allocations1),
        checksum(allocations2),
    ];
};
