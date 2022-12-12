export const lens = <T, U extends keyof T>(prop: U) => (item: T): T[U] => item[prop];

export const ascending = (a: number, b: number) => a > b ? 1 : -1;

export const descending = (a: number, b: number) => a < b ? 1 : -1;
