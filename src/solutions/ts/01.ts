import {getDeltas} from './utils';

export default (rawInput: string) => {
    const input = rawInput.split('\n').map(v => +v);
    const inputLength = input.length;

    // PART 1
    const positiveDeltas = getDeltas(input).filter(v => v > 0);
    console.log('Part 1:', positiveDeltas.length);

    // PART 2
    const positiveWindows = input.filter((v, i) => (i < inputLength - 3) && input[i + 3] > v);
    console.log('Part 2:', positiveWindows.length);
};
