export default (rawInput: string) => {
    const heightAt = rawInput.split('\n').map(line => line.split('').map(Number));

    const HEIGHT = heightAt.length;
    const WIDTH = heightAt[0].length;
    const PLATEAU = 9;

    // PART 1
    type Location = [number, number];
    const getAdjacentLocations = ([y, x]: Location) => {
        const adjacent: Location[] = [];
        if (y > 0) adjacent.push([y - 1, x]);
        if (y < HEIGHT - 1) adjacent.push([y + 1, x]);
        if (x > 0) adjacent.push([y, x - 1]);
        if (x < WIDTH - 1) adjacent.push([y, x + 1]);
        return adjacent;
    };

    const lowPoints: Location[] = [];
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const ownHeight = heightAt[y][x];
            const adjacent = getAdjacentLocations([y, x]);
            if (adjacent.every(([ya, xa]) => heightAt[ya][xa] > ownHeight)) lowPoints.push([y, x]);
        }
    }
    const part1 = lowPoints.reduce((sum, [y, x]) => sum + 1 + heightAt[y][x], 0);

    // PART 2
    const getBasin = ([yMin, xMin]: Location) => {
        const basin = new Set<string>([`${yMin},${xMin}`]);
        let added: Location[] = [[yMin, xMin]];

        do {
            added = added.map(([y, x]) => getAdjacentLocations([y, x]).filter(([yNext, xNext]) => heightAt[yNext][xNext] !== PLATEAU && !basin.has(`${yNext},${xNext}`))).flat();
            added.forEach(([y, x]) => basin.add(`${y},${x}`));
        } while (added.length);

        return basin.size;
    };

    const part2 = lowPoints.map(getBasin).sort((a, b) => b - a).slice(0, 3).reduce((res, v) => res * v, 1);

    return [part1, part2];
};
