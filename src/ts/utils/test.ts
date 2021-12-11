import {table as createTable} from 'table';
import {readFileSync} from 'fs';
import {join} from 'path';
import {run} from './run';

const RESET = '\x1b[0m';
const FG_RED = '\x1b[31m';
const FG_GREEN = '\x1b[32m';

const CHECK = `${FG_GREEN}✓${RESET}`;
const CROSS = `${FG_RED}X${RESET}`;

const fail = (day: number, part: 1 | 2, expected: number, actual: number) =>
    console.error(`${FG_RED}Day ${day} (Part ${part}): Expected ${expected} but got ${actual}.${RESET}`);

const toPrecision = (ms: number, precision = 4) => {
    const [fullMs, splitMs] = `${ms}`.split('.');
    return `${fullMs}.${(splitMs + '0000').slice(0, precision)}`;
};

(() => {
    const runs = process.argv[2] ? +process.argv[2] : 1;
    if (typeof runs !== 'number') throw new Error('Invalid argument for #runs');

    if (runs > 1) console.log(`Performing ${runs} runs`);

    const expected = readFileSync(
        join(join(__dirname, '..', '..', 'solutions.txt')),
        {encoding: 'utf-8'}
    )
        .split('\n')
        .map(line => line.split(' ').map(Number));

    const actual = Array.from({length: expected.length}, (_, idx) => {
        const results = new Set<string>();
        let totalMs = 0;
        for (let i = 0; i < runs; i++) {
            const [part1, part2, elapsedMs] = run(idx + 1);
            results.add(`${part1},${part2}`);
            totalMs += elapsedMs;
        }
        if (results.size > 1) {
            console.error(`Diverging results for day ${idx + 1}: ${[...results]}`);
            throw new Error(`Diverging results for day ${idx + 1}: ${[...results]}`);
        };
        return [...[...results][0].split(',').map(Number), totalMs / runs];
    });

    const results = actual.map(([actual1, actual2, elapsedMs], idx) => {
        const [expected1, expected2] = expected[idx];

        const res = [idx + 1, actual1 === expected1, actual2 === expected2, elapsedMs];
        if (!res[1]) fail(idx + 1, 1, expected1, actual1);
        if (!res[2]) fail(idx + 1, 2, expected2, actual2);

        return res as [number, boolean, boolean, number];
    });
    console.log();

    const success = results.reduce((sum, [_, part1, part2]) => sum + +part1 + +part2, 0);
    const failure = results.reduce((sum, [_, part1, part2]) => sum + +!part1 + +!part2, 0);

    const totalElapsed = results.reduce((sum, v) => sum + v[3], 0);
    const table = createTable(
        [
            ['Day', 'Part 1', 'Part 2', 'Elapsed (ms)'],
            ...results.map(([day, part1, part2, ms]) => [day, part1 ? CHECK : CROSS, part2 ? CHECK : CROSS, toPrecision(ms)]),
            ['', '', 'Sum', toPrecision(totalElapsed)],
            ['', '', 'Avg', toPrecision(totalElapsed / actual.length)],
        ],
        {
            columns: [
                {alignment: 'center'},
                {width: 7, alignment: 'center'},
                {width: 7, alignment: 'center'},
                {alignment: 'right'},
            ],
            header: {
                content: 'Test + Performance Results',
            },
            drawHorizontalLine: (idx, total) => [0, 1, 2, total - 2, total].includes(idx),
        },
    );
    console.log(table);

    if (failure) console.log(`${FG_RED}FAILURE${RESET}: ${failure} out of ${failure + success} tests failed`);
    else console.log(`${FG_GREEN}SUCCESS${RESET}: ${success} out of ${success} tests succeeded`);
    console.log();
})();
