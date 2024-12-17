import {range} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    enum Instructions {adv, bxl, bst, jnz, bxc, out, bdv, cdv}

    const parse = (input: string) => {
        const [registers, program] = input.split('\n\n');

        return [
            registers.split('\n').map(line => +line.split(' ').at(-1)),
            program.split(' ').at(-1).split(',').map(Number),
        ];
    };
    const [[startA, startB, startC], program] = parse(rawInput);

    // PART 1
    /*
    const simulate = (A: number, B: number, C: number, program: number[], part2: boolean): [string, number] => {
        const combo = (operand: number) => {
            switch (operand) {
                case 0:
                case 1:
                case 2:
                case 3:
                    return operand;
                case 4: return A;
                case 5: return B;
                case 6: return C;
                case 7: throw new Error('invalid combo operand');
            }
        };

        const START_A = A;

        let ptr = 0;
        let outputIdx = 0;
        let logged = true;
        const output: number[] = [];
        while (true) {
            if (ptr >= program.length) break;

            const operand = program[ptr + 1];
            switch (program[ptr]) {
                case Instructions.adv:
                    A = Math.floor(A / Math.pow(2, combo(operand)));
                    break;
                case Instructions.bxl:
                    B = operand ^ B;
                    break;
                case Instructions.bst:
                    B = combo(operand) % 8;
                    break;
                case Instructions.jnz:
                    if (A === 0) break;
                    ptr = operand - 2; // counteract increment
                    break;
                case Instructions.bxc:
                    B = B ^ C;
                    break;
                case Instructions.out:
                    const next = combo(operand) % 8;
                    output.push(next);

                    if (part2) {
                        if (program[outputIdx] !== next) return [null, outputIdx];

                        outputIdx++;
                        if (outputIdx >= 6 && !logged) {
                            console.log(START_A, output);
                            logged = true;
                        }
                    }
                    break;
                case Instructions.bdv:
                    B = Math.floor(A / Math.pow(2, combo(operand)));
                    break;
                case Instructions.cdv:
                    C = Math.floor(A / Math.pow(2, combo(operand)));
                    break;
                default:
                    throw new Error('invalid op code');
            }
            ptr += 2;
        }

        return [output.join(','), outputIdx];
    };
*/

    /** simplified
     * B = (A % 8) ^ 7                 // 7 - (A % 8)
     * C = floor(A / Math.pow(2, B))   // A right shift B
     * print ((B ^ 7) ^ C) % 8
     * A = floor(A / Math.pow(2, 3))   // A right shift 3
     * jnz A
     */

    const simulate = (A: number, B: number, C: number, program: number[], part2: boolean): [string, number] => {
        const output = [];
        while (A) {
            B = (A % 8) ^ 7;
            C = Math.floor(A / Math.pow(2, B));
            output.push(((B ^ 7) ^ C) % 8);
            A = Math.floor(A / Math.pow(2, 3));
        }
        return [output.join(','), output.length];
    };

    /*
    let a = -1;
    while (true) {
        a++;
        if (a === startA) continue;
        //if (a % 1e6 === 0) console.log(a);
        if (simulate(a, startB, startC, program, true)[1] === 5) break;
        //console.log(a, simulate(a, startB, startC, program, false))
        //if (simulate(a, startB, startC, program, false)[0].length > 11) break;
        //if (simulate(a, startB, startC, program, false)[0][6] === '7') console.log(a);
        //if (a > 4e4) break;
    }
        */
    console.log(1e10, simulate(1e10, startB, startC, program, false));

    // len(n) ~ 8^n

    // first A to match up to n digits
    // n          A
    // 1          2
    // 2        296
    // 3        923
    // 4      34715
    // 5    1611675

    // digit 2 = 4  w   delta
    //  32.. 47     16
    // 296..303     16  31*8
    // 544..559     16  30*8
    // 808..815     8   31*8
    // 920..927     8   13*8
    // 984..991     8   7*8
    // 1056..1071   16  8*8
    // 1320..1327   8   31*8
    // 1552..1583   32  28*8

    // digit 3 = 1
    //  64..127
    // 576..639 (+7*64)
    // 896..959 (+7*64)
    // --> (0100000) repeating 64-width blocks

    // digit 4 = 7  w   delta
    // 14336..14847 512
    // 34304..34815 512 38*512
    // 38400..38911 512 7*512

    /**
     * for digit n
     * scan up to 2^(3*(n+2))
     * collect candidates
     * 
     */
    /*
    const matches = new Map<number, number[]>();
    const seed = range(0, Math.pow(2, 9)).filter(v => simulate(v, startB, startC, program, true)[1] >= 1);
    matches.set(1, seed);
    for (let idx = 2; idx <= 14; idx++) {
        const delta = Math.pow(2, 3 * (idx + 1));
        const next = new Set<number>();

        const MAX = 128 * delta + matches.get(idx - 1)[0] - 1;
        console.log({idx, delta, MAX});

        let offset = 0;
        outer: while (true) {
            for (const candidate of matches.get(idx - 1)) {
                //console.log(candidate + offset * delta, simulate(candidate + offset * delta, startB, startC, program, true)[1]);
                const test = candidate + offset * delta;
                if (test > MAX) break outer;

                if (simulate(candidate + offset * delta, startB, startC, program, true)[1] >= idx) {
                    next.add(candidate + offset * delta);
                    //if (next.size >= 64) break outer;
                }
            }
            offset++;
        }
        console.log(next.size);
        matches.set(idx, [...next].sort((a, b) => a - b));
    }
    console.log(matches);
    */
    /**
      35184372088832 = 2^45

      54546108457885,
     617496061879197, ~
    1180446015300509, ~
    1743395968721821,
    2306345922143133,
    2869295875564445,
    3432245828985757,
    3995195782407069
     */

    /**
 296 [ 2, 4 ]
 923 [ 2, 4 ]
 925 [ 2, 4 ]
 989 [ 2, 4 ]
1320 [ 2, 4 ] <--
1554 [ 2, 4 ]
1555 [ 2, 4 ]
1683 [ 2, 4 ]
1745 [ 2, 4 ]
     */


    /** REAL 
     * len = 5 (delta = 2^18 = 262144)
     *  730011 x
     *  730013 x
     * 1611675
     * 1611677
     * 1677211
     * 1677213
     * 1742747
     * 1742749
     * 1774491 x
     * 1774493 x
     * 1778587 x
     * 1778589 x
     * 1808283
     * 1808285
     * 2827163 x <<<<<<<< = 730011 + 8 * delta
     * 2827165 x
     * 
     * len = 6 (delta = 2^21 = 2097152)
     *  730011
     *  730013
     * 1774491
     * 1774493
     * 1778587
     * 1778589
     * 2827163 <<<<<<< = 730011 + d
     * 2827165
     * 3867547 = 1774491 + d
     * 3867549
     * 
     * len = 7 (delta = )
     * 17507227
     */


    /** SAMPLE 
     * 
     * len = 3
     *  2752- 2759
     *  6848- 6855 (2752 + 4096*n) 2^12
     * 10944-10951
     * ...
     * 
     * len = 4
     * 19136-19143
     * 51904-51911 (19136 + 32768*n) 2^15
     * 84672-84679
     * 117440-117447
     * 
     * len = 5
     * 117440
     * 
     * len = 3
     * --> find 2^(4*(len+1)) start indexes
     * --> 
     */

    console.log(simulate(296, startB, startC, program, false)[0]);
    // 2,4,1,7,7,5,0,3,1,7,4,1,5,5,5,3,2,2
    // 2,4,1,7,7,5,0,3,1,7,4,1,5,5,5,1
    // 2,4,1,7,7,5,0,3,1,7,4,1,5,5,3,0

    return [
        simulate(startA, startB, startC, program, false)[0], // 1,0,2,0,5,7,2,1,3
        // 281474976710656 high
    ];
};
