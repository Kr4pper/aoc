export default (rawInput: string) => {
    const lines = rawInput.split('\n');

    const HEIGHT = lines.length + 2;
    const WIDTH = lines[0].length + 2;
    const PLATEAU = 9;

    const heightAt = [
        new Array(HEIGHT).fill(PLATEAU),
        ...lines.map(line => [PLATEAU, ...line.split('').map(Number), PLATEAU]),
        new Array(HEIGHT).fill(PLATEAU),
    ];

    type Location = [number, number];
    const getAdjacentLocations = ([y, x]: Location): Location[] => [[y - 1, x], [y + 1, x], [y, x - 1], [y, x + 1]];

    const visited = new Array(HEIGHT).fill(0).map(() => new Array(WIDTH).fill(false));
    const basins: [number, number][] = [];
    for (let yStart = 1; yStart < HEIGHT - 1; yStart++) {
        for (let xStart = 1; xStart < WIDTH - 1; xStart++) {
            if (visited[yStart][xStart]) continue;
            if (heightAt[yStart][xStart] === PLATEAU) continue;

            let size = 0;
            let min = PLATEAU;
            const flood = ([y, x]: Location): void => {
                if (y === 0 || x === 0 || y === HEIGHT - 1 || x === WIDTH - 1) return;
                if (visited[y][x]) return;

                const height = heightAt[y][x];
                if (heightAt[y][x] === PLATEAU) return;

                min = Math.min(min, height);
                size++;
                visited[y][x] = true;

                getAdjacentLocations([y, x]).forEach(flood);
            };

            flood([yStart, xStart]);
            basins.push([size, min]);
        }
    }

    return [
        basins.reduce((sum, b) => sum + b[1], basins.length),
        basins.map(b => b[0]).sort((a, b) => b - a).slice(0, 3).reduce((res, v) => res * v, 1),
    ];
};
