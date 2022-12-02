export const timed = <T>(
    description: string,
    fn: () => T,
): T => {
    const _description = description.padEnd(20, ' ');

    console.time(_description);
    const res = fn();
    console.timeEnd(_description);

    return res;
};
