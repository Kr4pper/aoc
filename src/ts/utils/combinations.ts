export function* combinations<T, U>(it1: Iterable<T>, it2: Iterable<U>) {
    let i = 0;
    for (const el1 of it1) {
        let j = 0;
        for (const el2 of it2) {
            if (i <= j) continue;
            yield [el1, el2] as const;
            j++;
        }
        i++;
    }
};
