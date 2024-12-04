import {Grid2D, Hashtable} from '../utils';

export default (jetStream: string): [(number | string)?, (number | string)?] => {
    // PART 1
    const ROCKS = [
        [4, 1, [0, 0], [1, 0], [2, 0], [3, 0]],
        [3, 3, [1, 0], [0, -1], [1, -1], [2, -1], [1, -2]],
        [3, 3, [2, 0], [2, -1], [0, -2], [1, -2], [2, -2]],
        [1, 4, [0, 0], [0, -1], [0, -2], [0, -3]],
        [2, 2, [0, 0], [1, 0], [0, -1], [1, -1]]
    ] as const;

    const ROCK_LENGTH = ROCKS.length;
    const JET_LENGTH = jetStream.length;
    const PART1_ROCKS = 2022;
    const CANYON_WIDTH = 7;
    const START_X = 2;
    let rockCounter = 0;
    let jetCounter = 0;
    let formationHeight = 0;
    const formation = new Grid2D(PART1_ROCKS * 5, CANYON_WIDTH);
    formation.incrementLine(0, 0, CANYON_WIDTH, 0);

    let part1: number;
    let part2: number;
    const cache: Hashtable<[number, number]> = {};
    for (let n = 0; n < 1e12; n++) {
        if (n === PART1_ROCKS) part1 = formationHeight;
        const [width, height, ...tiles] = ROCKS[rockCounter];

        // adapted from https://www.programiz.com/python-programming/methods/built-in/divmod
        function divmod(a: number, b: number) {
            var remainder = a % b;
            var aIsInfinite = a === -Infinity || a === Infinity;
            var bIsInfinite = b === -Infinity || b === Infinity;
            var aIsNeg = a + 1 / a < 0;
            var bIsNeg = b + 1 / b < 0;
            return [
                (aIsInfinite !== bIsInfinite && a) ? aIsInfinite ? NaN : aIsNeg === bIsNeg ? 0 : -1 : Math.floor(a / b),
                (!a && b < 0) ? -0 : remainder + (remainder !== 0 && aIsNeg !== bIsNeg ? b : 0)
            ];
        }

        // adapted from https://topaz.github.io/paste/#XQAAAQC4BAAAAAAAAAA5G8iNzA96Qa088jTp5Ejfbji94jfZrlIdoFF1L9sFu0LGygmgp2I70u9FstDo0dRkTOWyMzphAzE8vDJhtED9maqusKoQRbW1TEvMnKdz1ym/9s0fELQ+THwZSTAynI+UssZcUbkcEwgA7EnnbIuQq1b4nKoxBf6695yfyNF2p+utGtr3ocbbaIxMtJKNMtGJ+Wgk+aVl+nmf8+4qooQGdrXslam1yITXCzYZZdbIuTvRQQKt9KwYoNE0shvXSyELW6mXjwt1qI7cJCjI2dkhg1sHAs33+aqvQA+2d47hpRpf6Lhk69mhKQO4NujOTKGHRMiSeCcvkczfKUekPKuS8AM9NuOYdiKy1yPupbzkKDPR+Ch0qT6iDl0r3EfixAWbHxC1HRmBS4Z0Dy8uNUEpmwOJffNFVIrXUqPtZufOZ5LQCCXns3l0BC5iWNCTLjYvNwPFtXfcW4ALNDcfrllK3k33Qd3iq750gsELEFXX0fnGe9OcaeW8Lk+FGxF9YXbXuKU2h23pouQEGEW7RxnUDONs6ytSloqA9JmlbBxt7kqmwnfb4+41VK/LBZIa24WbpLIe1uhUFxSop7SJifl5J7ImSXejpdqnEWOA4md5hjXNZ8S31CATRmdYUzeYJ+cOSFNcPNE5/8AUjNTrgJnMrnO7X1PLY6mSBpRQr08HLbQScVGiNj9jxwOBvaY1uHFFj5X4MYNnXlCFcZEIVYCNMAZqiL//9cv1HQ==
        const key = `${rockCounter},${jetCounter}`;
        if (cache[key]) {
            const [N, H] = cache[key];
            const [d, m] = divmod(1e12 - n, N - n);
            if (!m) {
                part2 = formationHeight + (H - formationHeight) * d;
                break;
            }
        }
        else cache[key] = [n, formationHeight];

        let x = START_X;
        let y = formationHeight + height + 3;
        const impendingCollisionDown = (tiles: (readonly [number, number])[]) => tiles.some(([tx, ty]) => formation.get(tx + x, ty + y - 1));
        const impendingCollisionSide = (dx: number, tiles: (readonly [number, number])[]) => tiles.some(([tx, ty]) => formation.get(tx + x + dx, ty + y));

        while (true) {
            jetCounter = (jetCounter + 1) % JET_LENGTH;
            if (jetStream[jetCounter] === '<') {
                if (x > 0 && !impendingCollisionSide(-1, tiles)) x--;
            }
            else if (x + width < CANYON_WIDTH && !impendingCollisionSide(1, tiles)) x++;

            if (impendingCollisionDown(tiles)) break;
            y--;
        };

        rockCounter = (rockCounter + 1) % ROCK_LENGTH;
        formationHeight = Math.max(formationHeight, tiles[0][1] + y);
        for (const [tx, ty] of tiles) formation.set(tx + x, ty + y, 1);
    }

    // off by 7???
    return [
        part1 + 7,
        part2 + 7,
    ];
};
