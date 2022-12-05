export const counter = <T extends string | number>(it: Iterable<T>) => {
    const letterCount = new Map<T, number>();
    for (const letter of it) {
        if (!letterCount.has(letter)) letterCount.set(letter, 1);
        else letterCount.set(letter, letterCount.get(letter) + 1);
    }
    return letterCount;
};
