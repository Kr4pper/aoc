import {memoizeBy} from './utils';

export default (rawInput: string) => {
    const [_, start1, __, start2] = rawInput.split('\n').map(line => line.match(/(\d*)$/)).flat().map(Number);

    const part1 = (start1: number, start2: number) => {
        const WIN_THRESHOLD = 1000;

        let p1 = +start1;
        let p2 = +start2;
        let p1score = 0;
        let p2score = 0;
        let i = 1;
        while (p1score < WIN_THRESHOLD && p2score < WIN_THRESHOLD) {
            if (i % 2 === 1) p1score += p1 = (p1 + 3 * i + 3 - 1) % 10 + 1;
            else p2score += p2 = (p2 + 3 * i + 3 - 1) % 10 + 1;

            i += 3;
        }
        return Math.min(p1score, p2score) * (i - 1);
    };


    const part2 = (start1: number, start2: number) => {
        const WIN_THRESHOLD = 21;
        const wins = [0, 0];

        const possibleRollSums: Map<number, number> = new Map();
        for (let r1 = 1; r1 <= 3; r1++) {
            for (let r2 = 1; r2 <= 3; r2++) {
                for (let r3 = 1; r3 <= 3; r3++) {
                    const sum = r1 + r2 + r3;
                    possibleRollSums.set(sum, (possibleRollSums.get(sum) || 0) + 1);
                }
            }
        }

        const quantumTurn = (
            player: 0 | 1,
            rollSum: number,
            state: [number, number, number, number],
            count: number,
        ) => {
            const space = state[player] = (state[player] + rollSum - 1) % 10 + 1;
            const score = state[player + 2] += space;
            if (score >= WIN_THRESHOLD) {
                wins[player] += count;
                return;
            }

            for (const [sum, nextCount] of possibleRollSums) {
                quantumTurn(
                    player === 1 ? 0 : 1,
                    sum,
                    [state[0], state[1], state[2], state[3]],
                    count * nextCount,
                );
            }
        };

        for (const [sum, count] of possibleRollSums) {
            quantumTurn(0, sum, [start1, start2, 0, 0], count);
        }

        return Math.max(...wins);
    };

    return [
        part1(start1, start2),
        part2(start1, start2),
    ];
};
