import {ArgumentParser} from 'argparse';
import {readFileSync} from 'fs';
import {join} from 'path';
import {table as createTable} from 'table';
import {toDay} from './input';
import {run} from './run';

const RESET = '\x1b[0m';
const TEXT_RED = '\x1b[31m';
const TEXT_GREEN = '\x1b[32m';
const TEXT_YELLOW = '\x1b[33m';

const green = (text: string) => `${TEXT_GREEN}${text}${RESET}`;
const red = (text: string) => `${TEXT_RED}${text}${RESET}`;
const yellow = (text: string) => `${TEXT_YELLOW}${text}${RESET}`;

const CHECK = green('✓');
const CROSS = red('X');
const QUESTION_MARK = yellow('?');

enum Result {
    Passed,
    Failed,
    Skipped,
}

const fail = (day: number, part: 1 | 2, expected: string, actual: string) =>
    console.error(red(`Day ${day} (Part ${part}): Expected ${expected} but got ${actual}`));

const notRun = (day: number, part: 1 | 2, expected: string, actual: string) =>
    console.log(yellow(`Day ${day} (Part ${part}): Not run`));

const toPrecision = (ms: number, precision = 4) => {
    const [fullMs, splitMs] = `${ms}`.split('.');
    return `${fullMs}.${(splitMs + '0000').slice(0, precision)}`;
};

const tryLoadFixture = (year: number) => {
    try {
        return readFileSync(
            join(__dirname, '..', '..', 'fixtures', `${year}.txt`),
            {encoding: 'utf-8'},
        )
            .split('\n')
            .map(line => line.split(' '));
    } catch (e) {
        throw new Error(`Invalid argument for 'year': "${year}", expected "YYYY"`);
    }
};

const parser = new ArgumentParser();
parser.add_argument('-y', '--year', {default: new Date().getFullYear()});
parser.add_argument('-r', '--runs', {default: 1});

(() => {
    const {year, runs} = parser.parse_args();
    const fixture = tryLoadFixture(year);

    console.log(`Executing tests for ${year} (${runs} run${runs > 1 ? 's' : ''})\n`);

    const expected = fixture.map(([part1, part2]) => [part1, part2]);
    const descriptions = fixture.map(([_, __, ...description]) => description.join(' '));

    const actual: [string, string, number][] = Array.from({length: expected.length}, (_, idx) => {
        if (expected[idx][0] === '-' && expected[idx][1] === '-') {
            return [undefined, undefined, 0];
        }

        const results = new Set<string>();
        let totalMs = 0;
        for (let i = 0; i < runs; i++) {
            const {part1, part2, elapsedMs} = run(year, idx + 1);
            results.add(`${part1}~~~${part2}`);
            totalMs += elapsedMs;
        }

        if (results.size > 1) throw new Error(`Diverging results for day ${idx + 1}: ${[...results].join(' - ')}`);

        return [
            ...[...results][0].split('~~~'),
            totalMs / runs,
        ] as [string, string, number];
    });

    console.log(actual)

    const results = actual.map(([actual1, actual2, elapsedMs], idx) => {
        const [expected1, expected2] = expected[idx];

        const res = [
            idx + 1,
            expected1 === '-' ? Result.Skipped : (actual1 === expected1 ? Result.Passed : Result.Failed),
            expected2 === '-' ? Result.Skipped : (actual2 === expected2 ? Result.Passed : Result.Failed),
            elapsedMs
        ] as const;
        if (res[1] === Result.Failed) fail(idx + 1, 1, expected1, actual1);
        if (res[2] === Result.Failed) fail(idx + 1, 2, expected2, actual2);

        return res;
    });

    const count = (value: Result) => results.reduce((sum, [_, part1, part2]) => sum + +(part1 === value) + +(part2 === value), 0);
    const succeeded = count(Result.Passed);
    const failed = count(Result.Failed);
    const skipped = count(Result.Skipped);

    const elapsed = results.filter(([_, p1, p2]) => p1 !== Result.Skipped || p2 !== Result.Skipped).map(v => v[3]);
    const totalElapsed = elapsed.reduce((sum, v) => sum + v, 0);
    const averageElapsed = totalElapsed / elapsed.length;
    const lengthIsEven = Math.floor(elapsed.length / 2) === elapsed.length / 2;
    const meanElapsed = lengthIsEven
        ? (elapsed[elapsed.length / 2] + elapsed[elapsed.length / 2 - 1]) / 2
        : elapsed[(elapsed.length - 1) / 2];

    const maxDescriptionLength = descriptions.map(text => text.length).sort((a, b) => b - a)[0];
    const table = createTable(
        [
            ['Day', 'Part 1', 'Part 2', 'Elapsed (ms)'],
            ...results.map(([day, part1, part2, ms], idx) => [
                `${toDay(day)} - ${descriptions[idx]}`.padEnd(maxDescriptionLength + 5, ' '),
                part1 === Result.Skipped ? QUESTION_MARK : part1 === Result.Passed ? CHECK : CROSS,
                part2 === Result.Skipped ? QUESTION_MARK : part2 === Result.Passed ? CHECK : CROSS,
                part1 === Result.Skipped && part2 === Result.Skipped ? '-' : toPrecision(ms),
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

    const skippedMsg = skipped > 0 ? `, ${skipped} tests skipped` : '';

    if (failed > 0) console.log(`${red('FAILURE')}: ${failed} tests failed, ${succeeded} tests succeeded${skippedMsg}\n`);
    else console.log(`${green('SUCCESS')}: ${succeeded} tests succeeded${skippedMsg}\n`);
})();
