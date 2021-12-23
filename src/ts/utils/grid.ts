export class Grid2D<T extends number = number> {
    #height: number;
    #width: number;
    #size: number;
    #data: T[];

    constructor(
        height: number,
        width: number,
        fillValue = 0,
    ) {
        this.#height = height;
        this.#width = width;
        this.#size = height * width;
        this.#data = new Array(height * width).fill(fillValue);
    }

    get(x: number, y: number) {
        return this.#data[x + y * this.#height];
    }

    set(x: number, y: number, value: T) {
        this.#data[x + y * this.#height] = value;
    }

    increment(x: number, y: number) {
        this.#data[x + y * this.#height]++;
    }

    incrementLine(x1: number, y1: number, x2: number, y2: number) {
        const slope = (start: number, end: number) => start === end ? 0 : start > end ? -1 : 1;

        const dx = slope(x1, x2);
        const dy = slope(y1, y2);
        const length = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
        for (let i = 0; i <= length; i++) this.increment(x1 + i * dx, y1 + i * dy);
    }

    filter(predicate: (value: T) => boolean): T[] {
        return this.#data.filter(predicate);
    }

    count(predicate: (value: T) => boolean): number {
        return this.filter(predicate).length;
    }
}

export class Grid3D<T extends number = number>  {
    #height: number;
    #width: number;
    #depth: number;
    #size: number;
    #data: T[];
    #yMod: number;
    #zMod: number;

    constructor(
        height: number,
        width: number,
        depth: number,
        fillValue = 0,
    ) {
        this.#height = height;
        this.#width = width;
        this.#depth = depth;
        this.#size = height * width * depth;
        this.#data = new Array(this.#size).fill(fillValue);

        this.#yMod = height;
        this.#zMod = height * width;
    }

    get(x: number, y: number, z: number) {
        return this.#data[x + y * this.#yMod + z * this.#zMod];
    }

    set(x: number, y: number, z: number, value: T) {
        this.#data[x + y * this.#yMod + z * this.#zMod] = value;
    }

    increment(x: number, y: number, z: number) {
        this.#data[x + y * this.#yMod, z * this.#zMod]++;
    }

    setCube(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, value: T) {
        for (let x = x1; x <= x2; x++) {
            for (let y = y1; y <= y2; y++) {
                for (let z = z1; z <= z2; z++) {
                    this.set(x, y, z, value);
                }
            }
        }
    }

    filter(predicate: (value: T) => boolean): T[] {
        return this.#data.filter(predicate);
    }

    count(predicate: (value: T) => boolean): number {
        return this.filter(predicate).length;
    }
}
