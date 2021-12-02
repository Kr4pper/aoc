import {mkdirSync, existsSync, writeFileSync} from 'fs';
import {join} from 'path';
import {fetchInput, toDay} from './input';

const template = `export default (rawInput: string) => {
    const input = rawInput.split('\\n');

    // PART 1
    console.log('Part 1:');

    // PART 2
    console.log('Part 2:');
};
`;

(async () => {
    const rawDay = process.argv[2];
    if (!rawDay) throw new Error('Missing argument for day');
    const day = toDay(rawDay);

    const inputDir = join(__dirname, '..', 'input');
    if (!existsSync(inputDir)) {
        console.log('Creating input directory');
        mkdirSync(inputDir);
    }

    const inputFile = join(inputDir, day);
    if (!existsSync(inputFile)) {
        console.log('Fetching input data');
        const data = (await fetchInput(day)).data as string;

        console.log('Writing Input file');
        writeFileSync(inputFile, data.trimRight());
    }

    const solutionFile = join(__dirname, '..', 'solutions', `${day}.ts`);
    if (!existsSync(solutionFile)) {
        console.log('Writing solution file');
        writeFileSync(solutionFile, template);
    }
})();
