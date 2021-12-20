import {binaryStrToInt} from './utils';

export default (rawInput: string) => {
    const [enhancementAlgo, _, ...rawInputImage] = rawInput.split('\n');
    if (enhancementAlgo.length !== 512) throw new Error();

    const STEPS = 50;
    const PADDING = 102;
    const inputImage: string[] = [];
    for (let y = 0; y < rawInputImage.length + 2 * PADDING; y++) {
        let line = '';
        for (let x = 0; x < rawInputImage.length + 2 * PADDING; x++) {
            line += rawInputImage[y - PADDING]?.[x - PADDING] || '.';
        }
        inputImage.push(line);
    }

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
    const convertPixel = (image: string[], y: number, x: number): string => {
        const binary = VECTORS.map(([dy, dx]) => image[y + dy]?.[x + dx] || '.');
        return enhancementAlgo[binaryStrToInt(binary.map(v => v === '#' ? 1 : 0).join(''))];
    };

    const enhance = (image: string[], steps: number): string[] => {
        if (steps === 0) return image;

        const dim = image.length;
        const res: string[] = new Array(dim);
        for (let y = 0; y < dim; y++) {
            let line = '';
            for (let x = 0; x < dim; x++) line += convertPixel(image, y, x);
            res[y] = line;
        }

        return enhance(res, steps - 1);
    };


    const enhanced2 = enhance(inputImage, STEPS);
    const total2 = enhanced2
        .filter((_, i) => i >= PADDING / 2 && i <= enhanced2.length - PADDING / 2)
        .reduce((acc, line) => acc + line.split('')
            .filter((_, i) => i >= PADDING / 2 && i <= enhanced2.length - PADDING / 2)
            .filter(v => v === '#').length, 0);
    console.log(total2);

    return [
        //total - edges,
        total2,
    ];
};
