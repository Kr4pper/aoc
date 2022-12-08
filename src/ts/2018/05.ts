import {range} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    // PART 1
    const residue = (polymer: number[]) => {
        let i = 0;
        while (true) {
            if (Math.abs(polymer[i] - polymer[i + 1]) === 32) {
                polymer.splice(i, 2);
                i--;
                if (i < 0) i = 0;
            } else i++;

            if (polymer.length === 0 || i === polymer.length - 1) break;
        }
        return polymer.length;
    };

    const reagent = rawInput.split('').map(c => c.charCodeAt(0));

    // PART 2
    const removeFromPolymer = (polymer: number[]) => (remove: number) => polymer.filter(v => ![0, 32].includes(v - remove));

    return [
        residue(reagent),
        Math.min(...range(65, 90).map(removeFromPolymer(reagent)).map(residue)),
    ];
};
