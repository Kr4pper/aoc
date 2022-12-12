import {descending} from '../utils';

export default (rawInput: string): [number?, number?] => {
    const chunks = rawInput.split('\n\n');

    const elves =
        chunks
            .map(c => c.split('\n').reduce((acc, calories) => acc + +calories, 0))
            .sort(descending);

    return [
        elves[0],
        elves[0] + elves[1] + elves[2],
    ];
};
