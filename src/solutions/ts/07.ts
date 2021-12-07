export default (rawInput: string) => {
    const crabs = rawInput.split(',').map(Number);

    // PART 1
    const linearCost = (positions: number[], target: number) => positions.reduce((sum, v) => sum + Math.abs(v - target), 0);

    const median = crabs.sort((a, b) => a - b)[Math.round(crabs.length / 2)]; // median minimizes cost(x) ~ x
    console.log('Part 1:', linearCost(crabs, median));

    // PART 2
    const gaussianSum = (n: number) => n * (n + 1) / 2;
    const gaussianCost = (positions: number[]) => (target: number) => positions.reduce((sum, v) => sum + gaussianSum(Math.abs(v - target)), 0);

    const mean = crabs.reduce((sum, v) => sum + v, 0) / crabs.length; // mean minimizes cost(x) ~ x²
    const candidates = [Math.floor(mean), Math.ceil(mean)]; // either of these minimizes cost(x) ~ x² + x
    console.log('Part 2:', Math.min(...candidates.map(gaussianCost(crabs))));
};
