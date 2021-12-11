import {gcd} from './gcd';

export const lcm = (a: number, b: number) => Math.abs(a * b) / gcd(a, b);
