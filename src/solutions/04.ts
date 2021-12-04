export default (rawInput: string) => {
    const input = rawInput.split('\n');

    // PARSING
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

    const bingoBoards = boards.map(b => {
        const rows = Array.from(b); // horizontal

        for (let i = 0; i < 5; i++) {
            rows.push(b.map(bb => bb[i])); // vertical
        }

        return rows;
    });

    // PART 1
    const getWinningBoard = (boards: number[][][], bingoNumbers: number[]): [number, number] => {
        for (let drawn of bingoNumbers) {
            for (let i = 0; i < boards.length; i++) {
                const board = boards[i];
                for (let row of board) {
                    const drawnIdx = row.indexOf(drawn);
                    if (drawnIdx !== -1) {
                        row.splice(drawnIdx, 1);
                        if (row.length === 0) {
                            return [i, drawn];
                        }
                    }
                }
            }
        }
    };

    const calculateScore = (winningBoard: number[][], lastDrawn: number) => {
        const sum = [...new Set(winningBoard.flat(1))].reduce((sum, v) => sum + v, 0);
        return lastDrawn * sum;
    };

    const [winner, lastDrawWinner] = getWinningBoard(bingoBoards, bingoNumbers);
    console.log('Part 1:', calculateScore(boards[winner], lastDrawWinner));

    // PART 2
    const getLosingBoard = (boards: number[][][], bingoNumbers: number[]): [number, number] => {
        const removed = [];

        for (let drawn of bingoNumbers) {
            for (let i = 0; i < boards.length; i++) {
                if (removed.indexOf(i) !== -1) continue;

                for (let row of boards[i]) {
                    const drawnIdx = row.indexOf(drawn);
                    if (drawnIdx !== -1) {
                        row.splice(drawnIdx, 1);
                        if (row.length === 0) {
                            if (removed.indexOf(i) !== -1) throw new Error(`double removal of ${i}`);
                            removed.push(i);
                            break;
                        }
                    }
                }

                if (removed.length === boards.length) {
                    return [i, drawn];
                }
            }
        }
    };

    const [loser, lastDrawLoser] = getLosingBoard(bingoBoards, bingoNumbers);
    console.log('Part 2:', calculateScore(boards[loser], lastDrawLoser));
};
