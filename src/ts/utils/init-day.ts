import {mkdirSync, existsSync, writeFileSync} from 'fs';
import {join} from 'path';
import {fetchInput, toDay} from './input';

const template = `export default (rawInput: string) => {
    const input = rawInput.split('\\n');

    // PART 1

    // PART 2

    return [];
};
`;

(async () => {
    const rawDay = process.argv[2];
    if (!rawDay) throw new Error('Missing argument for day');
    const day = toDay(rawDay);

    const inputDir = join(__dirname, '..', '..', 'input');
    if (!existsSync(inputDir)) {
        console.log('Creating input directory');
        mkdirSync(inputDir);
    }

    const inputFile = join(inputDir, day);
    if (!existsSync(inputFile)) {
        console.log('Fetching input data');
        const data = (await fetchInput(day)).data;

        console.log('Writing Input file');
        writeFileSync(inputFile, data.trimEnd());
    }

    const solutionFile = join(__dirname, '..', `${day}.ts`);
    if (!existsSync(solutionFile)) {
        console.log('Writing solution file');
        writeFileSync(solutionFile, template);
    }
})();
