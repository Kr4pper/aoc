import {ArgumentParser} from 'argparse';
import {mkdirSync, existsSync, writeFileSync} from 'fs';
import {join} from 'path';
import {fetchInput, toDay} from './input';

const template = `export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\\n');

    // PART 1

    // PART 2

    return [];
};
`;

const parser = new ArgumentParser();
parser.add_argument('-y', '--year', {default: new Date().getFullYear().toString()});
parser.add_argument('-d', '--day', {default: new Date().getDate().toString()});

(async () => {
    const {year, day: _day} = parser.parse_args();
    const day = toDay(_day);

    console.log(`Initializing setup for year ${year} day ${day}`);

    const inputDir = join(__dirname, '..', '..', 'input', year);
    if (!existsSync(inputDir)) {
        console.log('Creating input directory');
        mkdirSync(inputDir);
    }

    const inputFile = join(inputDir, day);
    if (!existsSync(inputFile)) {
        console.log('Fetching input data');
        const data = (await fetchInput(year, day)).data;

        console.log('Writing Input file');
        writeFileSync(inputFile, data.trimEnd());
    }
    else console.log('Input data already exists');

    const solutionDir = join(__dirname, '..', year);
    if (!existsSync(solutionDir)) {
        console.log('Creating solution directory');
        mkdirSync(solutionDir);
    }

    const solutionFile = join(solutionDir, `${day}.ts`);
    if (!existsSync(solutionFile)) {
        console.log('Writing solution file');
        writeFileSync(solutionFile, template);
    }
    else console.log('Solution file already exists');
})();
