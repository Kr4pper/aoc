export const complement = (set: Set<string>, toRemove: Set<string>) => new Set([...set].filter(v => !toRemove.has(v)));

export const intersection = (setA: Set<string>, setB: Set<string>) => {
    const [large, small] = [setA, setB].sort((a, b) => b.size - a.size);
    return new Set([...large].filter(v => small.has(v)));
};

export const setsEqual = <T>(a: Set<T>, b: Set<T>) => {
    if (a.size !== b.size) return false;

    for (const el of a) {
        if (!b.has(el)) return false;
    }

    return true;
};
