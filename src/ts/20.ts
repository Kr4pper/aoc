export default (rawInput: string) => {
    const [_enhancementAlgo, _, ...rawInputImage] = rawInput.split('\n');
    if (_enhancementAlgo.length !== 512) throw new Error();
    const LIGHT = '#';
    const DARK = '.';
    const enhancementAlgo = _enhancementAlgo.split('').map(v => v === LIGHT);
    const inputImage = rawInputImage.reduce<boolean[][]>((acc, line) => [...acc, line.split('').map(v => v === LIGHT)], []);

    const VECTORS = [
        [-1, -1],
        [-1, +0],
        [-1, +1],
        [+0, -1],
        [+0, +0],
        [+0, +1],
        [+1, -1],
        [+1, +0],
        [+1, +1],
    ];
    const binaryArrToInt = (bin: boolean[]) => bin.reverse().reduce((acc, v, idx) => acc + (v ? Math.pow(2, idx) : 0), 0);
    const convertPixel = (image: boolean[][], y: number, x: number) =>
        enhancementAlgo[binaryArrToInt(VECTORS.map(([dy, dx]) => image[y + dy]?.[x + dx]))];

    const enhance = (image: boolean[][], steps: number): boolean[][] => {
        if (steps === 0) return image;

        const dim = image.length;
        const res = new Array<boolean[]>(dim);
        for (let y = 0; y < dim; y++) {
            const line = new Array<boolean>(dim);
            for (let x = 0; x < dim; x++) line[x] = convertPixel(image, y, x);
            res[y] = line;
        }

        return enhance(res, steps - 1);
    };

    const solve = (input: boolean[][], steps: number) => {
        const PADDING = 2 * steps;
        const DIM = input.length + 2 * PADDING;

        const paddedImage = new Array<boolean[]>(DIM);
        for (let y = PADDING; y < DIM - PADDING; y++) {
            const line = new Array<boolean>(DIM);
            for (let x = PADDING; x < DIM - PADDING; x++) line[x] = input[y - PADDING]?.[x - PADDING];
            paddedImage[y] = line;
        }

        const enhanced = enhance(paddedImage, steps);
        return enhanced
            .filter((_, i) => i >= PADDING / 2 && i <= enhanced.length - PADDING / 2)
            .reduce((acc, line) => acc + line.filter((v, i) => v && i >= PADDING / 2 && i <= enhanced.length - PADDING / 2).length, 0);
    };

    const debug = (grid: boolean[][]) => {
        console.log(grid.map(line => line.map(e => e ? LIGHT : DARK).join('')).join('\n'));
    };

    return [
        solve(inputImage, 2),
        solve(inputImage, 50),
    ];
};
