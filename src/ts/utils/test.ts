import {table as createTable} from 'table';
import {readFileSync} from 'fs';
import {join} from 'path';
import {toDay} from './input';
import {run} from './run';

const RESET = '\x1b[0m';
const FG_RED = '\x1b[31m';
const FG_GREEN = '\x1b[32m';

const green = (text: string) => `${FG_GREEN}${text}${RESET}`;
const red = (text: string) => `${FG_RED}${text}${RESET}`;

const CHECK = green('✓');
const CROSS = red('X');

const fail = (day: number, part: 1 | 2, expected: number, actual: number) =>
    console.error(red(`Day ${day} (Part ${part}): Expected ${expected} but got ${actual}`));

const toPrecision = (ms: number, precision = 4) => {
    const [fullMs, splitMs] = `${ms}`.split('.');
    return `${fullMs}.${(splitMs + '0000').slice(0, precision)}`;
};

const loadFixture = (year: number) => readFileSync(
    join(__dirname, '..', '..', 'test', `${year}.txt`),
    {encoding: 'utf-8'},
)
    .split('\n')
    .map(line => line.split(' '));

(() => {
    const year = +process.argv[2];
    const runs = process.argv[3] ? parseInt(process.argv[3]) : 1;
    if (typeof runs !== 'number' || Number.isNaN(runs) || runs < 1) throw new Error(`Invalid argument for #runs: "${process.argv[2]}", should be >=1`);

    console.log(`Executing tests for ${year} (${runs} run${runs > 1 ? 's' : ''})\n`);

    const fixture = loadFixture(year);
    const expected = fixture.map(([part1, part2]) => [part1, part2].map(Number));
    const descriptions = fixture.map(([_, __, ...description]) => description.join(' '));

    const actual = Array.from({length: expected.length}, (_, idx) => {
        const results = new Set<string>();
        let totalMs = 0;
        for (let i = 0; i < runs; i++) {
            const [part1, part2, elapsedMs] = run(year, idx + 1);
            results.add(`${part1},${part2}`);
            totalMs += elapsedMs;
        }

        if (results.size > 1) throw new Error(`Diverging results for day ${idx + 1}: ${[...results].join(' - ')}`);

        return [
            ...[...results][0].split(',').map(Number),
            totalMs / runs,
        ];
    });

    const results = actual.map(([actual1, actual2, elapsedMs], idx) => {
        const [expected1, expected2] = expected[idx];

        const res = [idx + 1, actual1 === expected1, actual2 === expected2, elapsedMs];
        if (!res[1]) fail(idx + 1, 1, expected1, actual1);
        if (!res[2]) fail(idx + 1, 2, expected2, actual2);

        return res as [number, boolean, boolean, number];
    });

    const success = results.reduce((sum, [_, part1, part2]) => sum + +part1 + +part2, 0);
    const failure = results.reduce((sum, [_, part1, part2]) => sum + +!part1 + +!part2, 0);

    const elapsed = results.map(v => v[3]);
    const totalElapsed = elapsed.reduce((sum, v) => sum + v, 0);
    const averageElapsed = totalElapsed / actual.length;
    const lengthIsEven = Math.floor(actual.length / 2) === actual.length / 2;
    const meanElapsed = lengthIsEven
        ? (elapsed[actual.length / 2] + elapsed[actual.length / 2 - 1]) / 2
        : elapsed[(actual.length - 1) / 2];

    const maxDescriptionLength = descriptions.map(text => text.length).sort((a, b) => b - a)[0];
    const table = createTable(
        [
            ['Day', 'Part 1', 'Part 2', 'Elapsed (ms)'],
            ...results.map(([day, part1, part2, ms], idx) => [
                `${toDay(day)} - ${descriptions[idx]}`.padEnd(maxDescriptionLength + 5, ' '),
                part1 ? CHECK : CROSS,
                part2 ? CHECK : CROSS,
                toPrecision(ms),
            ]),
            ['', '', 'Sum', toPrecision(totalElapsed)],
            ['', '', 'Avg', toPrecision(averageElapsed)],
            ['', '', 'Mean', toPrecision(meanElapsed)],
        ],
        {
            columns: [
                {alignment: 'center'},
                {width: 7, alignment: 'center'},
                {width: 7, alignment: 'center'},
                {alignment: 'right'},
            ],
            drawHorizontalLine: (idx, total) => [0, 1, total - 3, total].includes(idx),
        },
    );
    console.log(table);

    if (failure) console.log(`${red('FAILURE')}: ${failure} tests failed, ${success} tests succeeded\n`);
    else console.log(`${green('SUCCESS')}: ${success} tests succeeded\n`);
})();
