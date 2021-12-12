export const binaryStrToInt = (str: string) => str.split('').reverse().reduce((acc, v, idx) => acc + (v === '1' ? Math.pow(2, idx) : 0), 0);
