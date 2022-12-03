import {intersection, memoize, range} from '../utils';

export default (rawInput: string): [number?, number?] => {
    const rucksacks = rawInput.split('\n');

    const score = memoize((char: string) => {
        const ascii = char.charCodeAt(0);
        if (ascii >= 97) return ascii - 96; // lowercase
        return ascii - 38; // uppercase
    });

    return [
        rucksacks.reduce((acc, rucksack) => acc + score([...rucksack.substring(0, rucksack.length / 2)].find(e => rucksack.lastIndexOf(e) > rucksack.length / 2 - 1)), 0),
        range(0, rucksacks.length / 3 - 1).reduce((acc, i) => acc + score([...intersection(new Set(rucksacks[3 * i]), intersection(new Set(rucksacks[3 * i + 1]), new Set(rucksacks[3 * i + 2])))][0]), 0),
    ];
};
