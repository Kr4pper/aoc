import {mkdirSync, existsSync, writeFileSync} from 'fs';
import {join} from 'path';
import {fetchInput, toDay} from './input';

const template = `export default (rawInput: string): [number?, number?] => {
    const input = rawInput.split('\\n');

    // PART 1

    // PART 2

    return [];
};
`;

(async () => {
    const year = new Date().getFullYear().toString();
    const rawDay = process.argv[2];
    if (!rawDay) throw new Error('Missing argument for day');
    const day = toDay(rawDay);

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
})();
