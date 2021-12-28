import {run} from './run';

(() => {
    const [year, day, useSample] = parseArgs();
    console.log(`Executing year ${year} day ${day}${useSample ? ' \x1b[31mwith sample input\x1b[0m' : ''}`);

    const [part1, part2, elapsedMs] = run(year, day, useSample);
    console.log('Part 1:', part1);
    console.log('Part 2:', part2);
    console.log('Elapsed (ms):', elapsedMs);
})();

function parseArgs(): [number, number, boolean] {
    let year = new Date().getFullYear();
    let day: number;
    let useSample = false;
    switch (process.argv.length) {
        case 3:
            day = +process.argv[2];
            break;
        case 4:
            if (!isNaN(+process.argv[3])) {
                year = +process.argv[2];
                day = +process.argv[3];
            }
            else {
                day = +process.argv[2];
                useSample = process.argv[3] === 'sample' || process.argv[3] === 's';
            }
            break;
        case 5:
            year = +process.argv[2];
            day = +process.argv[3];
            useSample = process.argv[4] === 'sample' || process.argv[4] === 's';
            break;
        default:
            throw new Error('Invalid arguments. Expected format: [year=current_year]? [day] [sample|s]?');
    }
    return [year, day, useSample];
}
