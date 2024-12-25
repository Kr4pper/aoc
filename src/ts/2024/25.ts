export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const parseChunk = (chunk: string[], isLock: boolean) => {
        const start = chunk[0][0];
        const stacks: number[] = [];
        for (let x = 0; x < chunk[0].length; x++) {
            let size = 0;
            for (let y = 0; y < chunk.length; y++) {
                if (chunk[y][x] !== start) break;
                size++;
            }
            stacks.push(isLock ? size - 1 : chunk.length - size - 1);
        }
        return stacks;
    };

    const locks: number[][] = [];
    const keys: number[][] = [];
    for (const chunk of rawInput.split('\n\n')) {
        const isLock = chunk[0][0] === '#';
        (isLock ? locks : keys).push(parseChunk(chunk.split('\n'), isLock));
    }

    const fitsLock = (lock: number[]) => (key: number[]) => {
        for (let i = 0; i < key.length; i++) {
            if (key[i] + lock[i] > 5) return false;
        }
        return true;
    };

    return [
        locks.reduce((a, lock) => a + keys.filter(fitsLock(lock)).length, 0),
    ];
};
