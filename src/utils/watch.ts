import { join } from 'path';
import { readInput } from '.';

(() => {
    const rawDay = process.argv[2];
    if (!rawDay) throw new Error('Missing argument for day to run.');

    const useSample = process.argv[3] === 'sample' || process.argv[3] === 's';
    if (useSample) console.log('USING SAMPLE INPUT');

    const day = ('0' + rawDay).slice(-2);
    const input = readInput(day + (useSample ? '.sample' : ''));

    try {
        const dayImport = require(join(__dirname, '..', 'solutions', day));
        console.time('elapsed');
        dayImport.default(input);
    }
    catch (e) {
        console.error('Execution failed:', e);
    }

    console.timeEnd('elapsed');
})();
