export default (rawInput: string) => {
    const heightAt = rawInput.split('\n').map(line => line.split('').map(Number));

    const HEIGHT = heightAt.length;
    const WIDTH = heightAt[0].length;
    const PLATEAU = 9;

    type Location = [y: number, x: number];
    const getAdjacentLocations = ([y, x]: Location): Location[] => [[y - 1, x], [y + 1, x], [y, x - 1], [y, x + 1]];

    const visited = new Array(HEIGHT).fill(0).map(() => new Array(WIDTH).fill(false));
    const basins: [size: number, min: number][] = [];
    for (let yStart = 0; yStart < HEIGHT; yStart++) {
        for (let xStart = 0; xStart < WIDTH; xStart++) {
            if (visited[yStart][xStart]) continue;
            if (heightAt[yStart][xStart] === PLATEAU) continue;

            let size = 0;
            let min = PLATEAU;
            const flood = ([y, x]: Location): void => {
                if (y === -1 || x === -1 || y === HEIGHT || x === WIDTH) return;
                if (visited[y][x]) return;
                visited[y][x] = true;

                const height = heightAt[y][x];
                if (height === PLATEAU) return;

                min = Math.min(min, height);
                size++;

                getAdjacentLocations([y, x]).forEach(flood);
            };

            flood([yStart, xStart]);
            basins.push([size, min]);
        }
    }

    return [
        basins
            .reduce((sum, b) => sum + b[1], basins.length),
        basins
            .sort((a, b) => b[0] - a[0])
            .slice(0, 3)
            .reduce((res, v) => res * v[0], 1),
    ];
};
