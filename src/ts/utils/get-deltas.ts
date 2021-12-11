export const getDeltas = (values: number[]) => values.slice(1).map((v, i) => v - values[i]);
