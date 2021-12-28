import {getDeltas} from '../utils';

export default (rawInput: string) => {
    const input = rawInput.split('\n').map(v => +v);
    const inputLength = input.length;

    return [
        getDeltas(input).filter(v => v > 0).length,
        input.filter((v, i) => (i < inputLength - 3) && input[i + 3] > v).length,
    ];
};
