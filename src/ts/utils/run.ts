import {join} from 'path';
import {readInput, toDay} from './input';

type HrTime = [sec: number, nano: number];
const elapsedMs = (
    [startSec, startNano]: HrTime,
    [endSec, endNano]: HrTime,
) => ((endSec - startSec) * 1e9 + endNano - startNano) / 1e6;

export const run = (
    day: number | string,
    useSample = false,
): [number, number, number] => {
    const _day = toDay(day);
    const dayFn = require(join(__dirname, '..', _day)).default as (input: string) => [number, number];
    const input = readInput(_day + (useSample ? '.sample' : ''));

    const start = process.hrtime();
    const [part1, part2] = dayFn(input);
    const end = process.hrtime();

    return [part1, part2, elapsedMs(start, end)];
};
