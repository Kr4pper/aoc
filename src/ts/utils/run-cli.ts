import {run} from './run';

(() => {
    const rawDay = process.argv[2];
    if (!rawDay) throw new Error('Missing argument for day to run.');

    const useSample = process.argv[3] === 'sample' || process.argv[3] === 's';
    if (useSample) console.log('USING SAMPLE INPUT');

    const [part1, part2, elapsedMs] = run(rawDay, useSample);
    console.log('Part 1:', part1);
    console.log('Part 2:', part2);
    console.log('Elapsed (ms):', elapsedMs);
})();
