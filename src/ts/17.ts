export default (input: string) => {
    type Target = [xMin: number, xMax: number, yMin: number, yMax: number];
    type State = [x: number, y: number, dx: number, dy: number];

    const [_, x1, x2, y1, y2] = input.match(/x=(-?\d*)..(-?\d*), y=(-?\d*)..(-\d*)/).map(Number);
    const target: Target = [x1, x2, y1, y2];

    const step = ([x, y, dx, dy]: State): State => [
        x + dx,
        y + dy,
        dx > 0 ? dx - 1 : dx === 0 ? 0 : -1,
        dy - 1,
    ];

    const unreachable = (
        [x, y, dx, dy]: State,
        [xMin, xMax, yMin, yMax]: Target,
    ) => x > xMax || y < yMin;

    const inTarget = (
        [x, y, dx, dy]: State,
        [xMin, xMax, yMin, yMax]: Target,
    ) => x >= xMin && x <= xMax && y >= yMin && y <= yMax;

    const hitsTarget = (target: Target, dx: number, dy: number) => {
        let state: State = [0, 0, dx, dy];
        while (!unreachable(state, target)) {
            state = step(state);
            if (inTarget(state, target)) return true;
        }
        return false;
    };

    const feasibleDx = ([xMin, xMax]: Target) => {
        const dxMin = Math.ceil((Math.sqrt(1 + 8 * xMin) - 1) / 2); // quadratic formula
        const dxMax = xMax;
        return Array
            .from({length: dxMax - dxMin + 1}, (_, i) => i + dxMin)
            .filter(dx => {
                let x = 0;
                while (true) {
                    x += dx;
                    dx--;
                    if (x >= xMin && x <= xMax) return true;
                    if (x > xMax) return false;
                }
            });
    };

    let max = 0;
    let hits = 0;
    for (const dx of feasibleDx(target)) {
        for (let dy = 150; dy > -150; dy--) {
            if (hitsTarget(target, dx, dy)) {
                max = Math.max(max, dy);
                hits++;
            }
        }
    }

    return [
        max / 2 * (max + 1),
        hits,
    ];
};
