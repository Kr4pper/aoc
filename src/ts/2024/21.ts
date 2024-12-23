import {Grid2D, Point} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    enum Moves {
        Up = '^',
        Right = '>',
        Down = 'v',
        Left = '<',
        Press = 'A',
    }

    const DIRECTIONS = {
        [Moves.Up]: [0, -1],
        [Moves.Right]: [1, 0],
        [Moves.Down]: [0, 1],
        [Moves.Left]: [-1, 0],
        [Moves.Press]: [0, 0],
    };

    const numericOutput = Grid2D.parse([
        ['7', '8', '9'],
        ['4', '5', '6'],
        ['1', '2', '3'],
        ['X', '0', 'A'],
    ]);

    const directionalOutput = Grid2D.parse([
        ['X', Moves.Up, 'A'],
        [Moves.Left, Moves.Down, Moves.Right],
    ]);

    function* permute<T>(a: T[], n = a.length): Generator<T[]> {
        if (n <= 1) yield a.slice();
        else for (let i = 0; i < n; i++) {
            yield* permute(a, n - 1);
            const j = n % 2 ? 0 : i;
            [a[n - 1], a[j]] = [a[j], a[n - 1]];
        }
    }

    class Keypad {
        private current = 'A';
        private buttons = new Map<string, Point>();
        private moves = new Map<string, string[]>(); // START,END -> Moves[]

        constructor(public output: Grid2D<string>, public input: Grid2D<string>) {
            this.initButtons();
            this.initMoveTable();
        }

        moveTo(next: string) {
            const choices = this.moves.get(`${this.current},${next}`);
            this.current = next;
            return choices;
        }

        reset() {
            this.current = 'A';
        }

        private initButtons() {
            for (const button of this.output.findAll(v => typeof v === 'string' && v !== 'X')) {
                this.buttons.set(this.output.get(...button), button);
            }
        }

        private initMoveTable() {
            for (const [start, [x1, y1]] of this.buttons.entries()) {
                for (const [end, [x2, y2]] of this.buttons.entries()) {
                    const key = `${start},${end}`;
                    if (start === end) {
                        this.moves.set(key, ['A']);
                        continue;
                    }

                    const [dx, dy] = [x2 - x1, y2 - y1];
                    const dirX = dx < 0 ? Moves.Left : Moves.Right;
                    const dirY = dy < 0 ? Moves.Up : Moves.Down;
                    const considered = new Set<string>();
                    const validMoveOrders: string[] = [];
                    for (const option of permute(dirX.repeat(Math.abs(dx)).concat(dirY.repeat(Math.abs(dy))).split(''))) {
                        const key = option.join('');
                        if (considered.has(key)) continue;
                        considered.add(key);

                        let x = x1;
                        let y = y1;
                        let valid = true;
                        for (const step of option as Moves[]) {
                            const [stepX, stepY] = DIRECTIONS[step];
                            x += stepX;
                            y += stepY;
                            if (this.output.get(x, y) === 'X') valid = false;
                        }
                        if (valid) validMoveOrders.push(option.join('') + 'A');
                    }
                    this.moves.set(key, validMoveOrders);
                }
            }
        }
    }

    for (const code of rawInput.split('\n')) {
        const numericKeypad = new Keypad(numericOutput, directionalOutput);
        const directionalKeypad1 = new Keypad(directionalOutput, directionalOutput);
        const directionalKeypad2 = new Keypad(directionalOutput, directionalOutput);
        //const setup = [numericKeypad, directionalKeypad1, directionalKeypad2, directionalKeypad3];

        /**
         * for each part of code
         * read 1 by one
         * get movement options for numpad
         * map each numpad movement option to movement for d1
         * map each d1 movement option to movement for d2
         * get min length of those
         * min(directional(directional(numpad(code))))
         */

        // [["vA"],["A"],["<^A","^<A"],[">A"]]

        const directional1 = <T extends string | string[]>(input: T): any => {
            if (typeof input === 'string') {
                directionalKeypad1.reset();
                return input.split('').map(char => directionalKeypad1.moveTo(char));
            }

            return input.map(directional1);
        };

        const directional2 = <T extends string | string[]>(input: T): any => {
            if (typeof input === 'string') {
                directionalKeypad2.reset();
                return input.split('').map(char => directionalKeypad2.moveTo(char));
            }

            return input.map(directional2);
        };

        const count = <T extends string | string[]>(input: T): any => {
            if (typeof input === 'string') {
                return input.length;
            }

            return input.map(count);
        };

        for (const output of code) {
            console.log('---', {output});
            const n = numericKeypad.moveTo(output);
            console.log(JSON.stringify(n));
            console.log(JSON.stringify(directional1(n)));
            const d2 = directional2(directional1(n));
            console.log(JSON.stringify(d2));
            const counted = count(d2);
            console.log(JSON.stringify(counted));
            /*
            const d1 = n.map(word => {
                const res = word.split('').map(char => {
                    const res = directionalKeypad1.moveTo(char);
                    console.log('d1', char, res);
                    return res;
                });
                directionalKeypad1.reset();
                return res;
            });
            console.log(JSON.stringify(d1));
            const d2 = d1.map(words => words.map(options => options.map(chars => chars.split('').map(char => {
                const res = directionalKeypad2.moveTo(char);
                console.log('d2', char, res);
                return res;
            }))));
            console.log(JSON.stringify(d2));
            const byCharLength = d2.map(as => as.map(b2 => b2.map(ds => ds.map(es => es.map(fs => Math.min(fs.length))))));
            console.log(JSON.stringify(byCharLength));
            const byWordLength = byCharLength.map(as => as.map(b2 => b2.map(ds => ds.map(es => Math.min(...es)))));
            console.log(JSON.stringify(byWordLength));
            */
        }
    }

    // word -> options -> characters

    /*
    <vA<AA>>^A  vAA<^A>A    <v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A
    v<<A>>^A    <A>A        vA<^AA>A<vAAA>^A
    <A          ^A          >^^A        vvvA
    0           2           9           A
    */


    /*
    console.log('---');

    // v<<A>>^A<A>AvA<^AA>A<vAAA>^A
    const directionalKeypad1 = new Keypad(directionalOutput, directionalOutput);
    for (const code of '<A^A>^^AvvvA') {
        for (const output of code) {
            console.log(output, directionalKeypad1.moveTo(output));
        }
    }
        */

    // PART 2

    return [];
};
