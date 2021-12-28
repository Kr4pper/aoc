export default (rawInput: string) => {
    const input = rawInput.split('\n');
    const bingoNumbers = input[0].split(',').map(Number);

    const boards: number[][][] = [];
    let nextBoard: number[][] = [];
    for (let i = 2; i <= input.length; i++) {
        if (!input[i]) {
            if (nextBoard.length === 5) {
                boards.push(nextBoard);
                nextBoard = [];
            }
            continue;
        }
        nextBoard.push(input[i].match(/(\D*(\d+))/g).map(Number));
    }

    const bingoBoards = boards.map(b => b.concat([0, 1, 2, 3, 4].map(i => b.map(bb => bb[i]))));

    // PART 1
    const getNthBestBoard = (boards: number[][][], bingoNumbers: number[], n: number): [number, number] => {
        const removed = [];

        for (let drawn of bingoNumbers) {
            for (let i = 0; i < boards.length; i++) {
                if (removed.indexOf(i) !== -1) continue;

                for (let row of boards[i]) {
                    const drawnIdx = row.indexOf(drawn);
                    if (drawnIdx !== -1) {
                        row.splice(drawnIdx, 1);
                        if (row.length === 0) {
                            removed.push(i);
                            break;
                        }
                    }
                }

                if (removed.length === n) return [i, drawn];
            }
        }
    };

    const calculateScore = (winningBoard: number[][], lastDrawn: number) => lastDrawn * [...new Set(winningBoard.flat(1))].reduce((sum, v) => sum + v, 0);

    const [winner, lastDrawWinner] = getNthBestBoard(bingoBoards, bingoNumbers, 1);
    const part1 = calculateScore(boards[winner], lastDrawWinner);

    // PART 2
    const [loser, lastDrawLoser] = getNthBestBoard(bingoBoards, bingoNumbers, bingoBoards.length);
    const part2 = calculateScore(boards[loser], lastDrawLoser);

    return [part1, part2];
};
