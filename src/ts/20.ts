export default (rawInput: string) => {
    const [_enhancementAlgo, _, ...rawInputImage] = rawInput.split('\n');
    if (_enhancementAlgo.length !== 512) throw new Error();
    const LIGHT = '#';
    const DARK = '.';
    const enhancementAlgo = _enhancementAlgo.split('').map(v => v === LIGHT ? 1 : 0);
    const input = rawInputImage.reduce<number[][]>((acc, line) => [...acc, line.split('').map(v => v === LIGHT ? 1 : 0)], []);

    const enhancePixel = (image: number[][], y: number, x: number) => enhancementAlgo[
        image[y - 1][x - 1] << 8
        | image[y - 1][x] << 7
        | image[y - 1][x + 1] << 6
        | image[y][x - 1] << 5
        | image[y][x] << 4
        | image[y][x + 1] << 3
        | image[y + 1][x - 1] << 2
        | image[y + 1][x] << 1
        | image[y + 1][x + 1]
    ];

    const pad = (grid: number[][]) => {
        const dim = input.length;
        const padding = enhancementAlgo[input[0][0] ? 0 : 2 << 9 - 1];
        for (let y = 0; y < dim; y++) {
            grid[y][0] = padding;
            grid[y][dim - 1] = padding;
        }
        for (let x = 0; x < dim; x++) {
            grid[0][x] = padding;
            grid[dim - 1][x] = padding;
        }
    };

    const enhance = (input: number[][], output: number[][]) => {
        pad(output);

        const dim = input.length;
        for (let y = 1; y < dim - 1; y++) {
            for (let x = 1; x < dim - 1; x++) {
                output[y][x] = enhancePixel(input, y, x);
            }
        }
    };

    const score = (grid: number[][], padding: number): number =>
        grid.filter((_, i) => i >= padding / 2 && i <= grid.length - padding / 2)
            .reduce((acc, line) => acc + line.filter((v, i) => v && i >= padding / 2 && i <= grid.length - padding / 2).filter(v => v).length, 0);

    const solve = (unpadded: number[][], steps: number) => {
        const PADDING = 2 * steps + 2;
        const DIM = unpadded.length + 2 * PADDING;

        let input = Array.from({length: DIM}, () => new Array(DIM).fill(0));
        for (let y = 1; y < DIM - 1; y++) {
            for (let x = 1; x < DIM - 1; x++) {
                input[y][x] = unpadded[y - PADDING]?.[x - PADDING] || 0;
            }
        }
        let output = Array.from({length: DIM}, () => new Array(DIM).fill(0));

        for (let i = 0; i < steps; i++) {
            if (i % 2 === 0) enhance(input, output);
            else enhance(output, input);
        }

        return score(steps % 2 === 0 ? input : output, PADDING);
    };

    return [
        solve(input, 2),
        solve(input, 50),
    ];
};
