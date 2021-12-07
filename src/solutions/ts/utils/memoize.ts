export const memoize = <T, Arg extends string | number>(
    wrapped: (arg: Arg) => T
) => {
    const cache: {[K in (string | number)]} = {};

    return (arg: Arg): T => {
        if (cache[arg]) return cache[arg];

        const value = wrapped(arg);
        cache[arg] = value;
        return value;
    };
};

export const memoizeBy = <T, Args extends any[]>(
    getKey: (args: Args) => string | number,
    wrapped: (args: Args) => T
) => {
    const cache = {};

    return (args: Args): T => {
        const key = getKey(args);
        if (cache[key]) return cache[key];

        const value = wrapped(args);
        cache[key] = value;
        return value;
    };
};
