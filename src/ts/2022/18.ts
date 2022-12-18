import {Grid3D} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {

    // PART 1
    const lava = new Grid3D(100, 100, 100, 0);

    /**
     * Z=1
     * 
     *  X
     * 
     * Z=2
     *  X
     * XXX
     *  X
     * 
     * Z=3
     * 
     *  X
     * 
     * Z=4
     *  
     *  X
     * 
     * Z=5
     *  X
     * X X
     *  X
     * 
     * Z=6
     * 
     *  X
     */

    const adjacent = (x: number, y: number, z: number) => [
        [x - 1, y, z],
        [x + 1, y, z],
        [x, y - 1, z],
        [x, y + 1, z],
        [x, y, z - 1],
        [x, y, z + 1],
    ];

    let surfaceArea = 0;
    for (const line of rawInput.split('\n')) {
        const [x, y, z] = line.split(',').map(Number);
        lava.set(x, y, z, 1);
        surfaceArea += 6;

        for (const [xx, yy, zz] of adjacent(x, y, z)) {
            if (lava.get(xx, yy, zz)) {
                surfaceArea -= 2;
                continue;
            }
        }
    }

    // need to properly scan surface for part 2
    // flood fill of outside
    // only consider blocks touching "outside"


    return [
        surfaceArea,
        // 2906 high
        // 98 wrong
        // 2696 wrong
    ];
};
