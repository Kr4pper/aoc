import {complement, intersection, setsEqual} from './utils';

export default (rawInput: string) => {
    type Letter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
    type Sequence = Letter[] & string;

    const LETTERS: Letter[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    const [A, B, C, D, E, F, G] = LETTERS;

    const entries = rawInput.split('\n').map(line => line.split('|').map(v => v.trim().split(' ') as unknown as Sequence[]));

    // PART 1
    const distinctLengths = [2, 3, 4, 7];
    const part1 = entries.reduce((sum, [_, output]) => sum + output.filter(v => distinctLengths.includes(v.length)).length, 0);

    // PART 2
    const DIGIT_TO_SEGMENTS = {
        0: new Set([A, B, C, E, F, G]),
        1: new Set([C, F]),
        2: new Set([A, C, D, E, G]),
        3: new Set([A, C, D, F, G]),
        4: new Set([B, C, D, F]),
        5: new Set([A, B, D, F, G]),
        6: new Set([A, B, D, E, F, G]),
        7: new Set([A, C, F]),
        8: new Set([A, B, C, D, E, F, G]),
        9: new Set([A, B, C, D, F, G]),
    };

    const weakConstraints: {[length: number]: Letter[];} = {
        2: [...DIGIT_TO_SEGMENTS[1]],
        3: [...DIGIT_TO_SEGMENTS[7]],
        4: [...DIGIT_TO_SEGMENTS[4]],
    };

    const strongConstraints: {[length: number]: Letter[];} = {
        2: [...DIGIT_TO_SEGMENTS[1]],
    };

    const easyEntries = (entries: Sequence[]) => entries.filter(entry => distinctLengths.includes(entry.length));

    type Options = {[digit in Letter]: Set<string>;};
    type Translation = {[digit in Letter]: string;};
    const assignResult = (options: Options, translation: Translation, shuffled: Letter, real: Letter) => {
        translation[shuffled] = real;

        for (const digit of LETTERS) {
            if (!options[digit]) continue;
            options[digit] = complement(options[digit], new Set(real));
        }
    };

    const assignMultiResult = (options: Options, translation: Translation, shuffled: Letter[], real: Letter[]) => {
        assignResult(options, translation, shuffled[0], real[0]);
        assignResult(options, translation, shuffled[1], real[1]);
        alternativesSet.add(real[0] + real[1]);
    };

    const results = {} as Translation;
    const alternativesSet = new Set<string>();
    const part2 = entries.reduce((sum, [input, output]) => {
        const options = LETTERS.reduce((res, v) => ({...res, [v]: new Set(LETTERS)}), {} as Options);
        for (const entry of easyEntries([...input, ...output])) {
            const shortRule = weakConstraints[entry.length];
            if (shortRule) [...entry].forEach(digit => options[digit] = intersection(options[digit], new Set(shortRule)));

            const directResult = strongConstraints[entry.length];
            if (directResult) assignMultiResult(options, results, entry, directResult);
        }

        while (true) {
            let optionsRemoved = false;

            const unsolved: [Letter, Set<Letter>][] = Object.entries(options).filter(([_, v]) => v.size > 0).map(([k, v]: [Letter, Set<Letter>]) => [k, new Set(v)]);
            unsolved.filter(([_, v]) => v.size === 1).forEach(([shuffled, real]) => { // only remaining option
                assignResult(options, results, shuffled, [...real][0]);
                optionsRemoved = true;
            });

            let twoOptions = unsolved.find(([_, v]) => v.size === 2);
            if (!twoOptions) break;

            let sameTwoOptions = unsolved.filter(([_, v]) => v.size === 2 && setsEqual(twoOptions[1], v));
            if (sameTwoOptions.length === 2) { // two interchangeable options
                assignMultiResult(options, results, [sameTwoOptions[0][0], sameTwoOptions[1][0]], [...sameTwoOptions[0][1]]);
                optionsRemoved = true;
            }

            if (!optionsRemoved) break;
        }

        const alternatives = [...alternativesSet];
        const potentialTranslations = Array.from({length: Math.pow(2, alternatives.length)}, ((_, i) => {
            const swaps = [];
            if (i & 1) swaps.push(alternatives[0]);
            if (i & 2) swaps.push(alternatives[1]);
            if (i & 4) swaps.push(alternatives[2]);
            return swaps;
        })).map(swaps => swaps.reduce((res, [a, b]) => {
            const aIdx = Object.entries(res).find(([_, v]) => v === a)[0];
            const bIdx = Object.entries(res).find(([_, v]) => v === b)[0];
            return {...res, [aIdx]: b, [bIdx]: a};
        }, results));

        const translate = (output: Sequence[], translation: Translation) => output.reduce((res, v) => [...res, new Set(v.split('').map(c => translation[c]))], []);

        const asDigits = (sequences: Set<Letter>[]) => {
            const digits = [];
            for (const sequence of sequences) {
                const res = Object.entries(DIGIT_TO_SEGMENTS).find(([_, v]) => setsEqual(sequence, v));
                if (!res) return null;

                digits.push(+res[0]);
            }
            return digits;
        };

        const toDigits = (output: Sequence[], translations: Translation[]) => {
            for (const translation of translations) {
                const digits = asDigits(translate(output, translation));
                if (!digits) continue;

                return digits;
            }
        };

        return sum + +toDigits(output, potentialTranslations).join('');
    }, 0);

    return [part1, part2];
};
