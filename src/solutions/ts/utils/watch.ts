import {join} from 'path';
import {readInput, toDay} from './input';

(() => {
    const rawDay = process.argv[2];
    if (!rawDay) throw new Error('Missing argument for day to run.');

    const useSample = process.argv[3] === 'sample' || process.argv[3] === 's';
    if (useSample) console.log('USING SAMPLE INPUT');

    const day = toDay(rawDay);
    const input = readInput(day + (useSample ? '.sample' : ''));

    try {
        console.log(join(__dirname, '..', day));
        const dayImport = require(join(__dirname, '..', day));
        console.time('elapsed');
        dayImport.default(input);
    }
    catch (e) {
        console.error('Execution failed:', e);
    }

    console.timeEnd('elapsed');
})();
