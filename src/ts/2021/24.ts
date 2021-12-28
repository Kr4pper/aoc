export default (rawInput: string) => {
    const blocks = rawInput.split('inp w\n').map(v => v.split('\n'));
    const maxInputs = Array(14).fill(0);
    const minInputs = Array(14).fill(0);
    const stack = [] as [number, number][];

    const argOf = (instruction: string) => +instruction.split(' ').slice(-1)[0];

    blocks.forEach((block, blockIdx) => {
        if (block[3] == 'div z 1') {
            stack.push([blockIdx, argOf(block[14])]);
        }
        if (block[3] == 'div z 26') {
            let [oldIdx, x] = stack.pop();
            let diff = x + argOf(block[4]);
            if (diff < 0) [blockIdx, oldIdx, diff] = [oldIdx, blockIdx, -diff];

            maxInputs[blockIdx] = 9;
            maxInputs[oldIdx] = 9 - diff;
            minInputs[blockIdx] = 1 + diff;
            minInputs[oldIdx] = 1;
        }
    });

    return [
        +maxInputs.join(''),
        +minInputs.join(''),
    ];
};
