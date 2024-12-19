export const memoize = <T, Arg extends string | number>(
    wrapped: (arg: Arg) => T
) => {
    const cache: {[K in Arg]?: T} = {};

    return (arg: Arg): T => {
        if (arg in cache) return cache[arg];

        const value = wrapped(arg);
        cache[arg] = value;
        return value;
    };
};

export const memoizeBy = <T, Args extends any[], K extends string | number>(
    getKey: (args: Args) => K,
    wrapped: (args: Args) => T
) => {
    const cache: {[key in K]?: T} = {};

    return (args: Args): T => {
        const key = getKey(args);
        if (key in cache) return cache[key];

        const value = wrapped(args);
        cache[key] = value;
        return value;
    };
};
