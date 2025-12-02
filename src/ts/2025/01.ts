export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n');

    // PART 1
    const parseRotation = (rotation: string) => {
        const [direction, ...turns] = rotation;
        return (direction === 'R' ? 1 : -1) * +turns.join('');
    };
    const rotations = input.map(parseRotation);

    let p1position = 50;
    let zeros = 0;
    for (const rotation of rotations) {
        p1position += rotation;
        if (p1position % 100 === 0) zeros++;
    }

    // PART 2
    let dialValue = 50;
    let zeroPasses = 0;
    let facingRight = true;
    for (let distance of rotations) {
        if ((distance > 0) !== facingRight) {
            dialValue = (100 - dialValue) % 100;
            facingRight = !facingRight;
        }

        dialValue += Math.abs(distance);
        zeroPasses += Math.floor(dialValue / 100);
        dialValue %= 100;
    }

    return [
        zeros,
        zeroPasses,
    ];
};
