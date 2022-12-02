import {Hashtable} from '../utils';

export default (rawInput: string): [number?, number?] => {
    const input = rawInput.split('\n');

    // PART 1
    type ScoreTable = Hashtable<Hashtable<number>>;
    const scoreTable1: ScoreTable = {
        A: {X: 4, Y: 8, Z: 3},
        B: {X: 1, Y: 5, Z: 9},
        C: {X: 7, Y: 2, Z: 6},
    };

    const getGameScore = (table: ScoreTable) => input.reduce((acc, turn) => acc + table[turn[0]][turn[2]], 0);

    // PART 2
    const scoreTable2: ScoreTable = {
        A: {X: 3, Y: 4, Z: 8},
        B: {X: 1, Y: 5, Z: 9},
        C: {X: 2, Y: 6, Z: 7},
    };

    return [
        getGameScore(scoreTable1),
        getGameScore(scoreTable2),
    ];
};
