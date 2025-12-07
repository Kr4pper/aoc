import {ArgumentParser} from 'argparse';
import {run} from './run';

const parser = new ArgumentParser();
parser.add_argument('-y', '--year', {default: new Date().getFullYear()});
parser.add_argument('-d', '--day', {default: new Date().getDate()});
parser.add_argument('-s', '--sample', {default: false, action: 'store_const', const: true});

(() => {
    const {year, day, sample} = parser.parse_args();
    console.log(`Executing year ${year} day ${day}${sample ? ' \x1b[31mwith sample input\x1b[0m' : ''}`);

    const {part1, part2, elapsedMs} = run(year, day, sample);
    console.log('Part 1:', part1);
    console.log('Part 2:', part2);
    console.log('Elapsed (ms):', elapsedMs);
})();
