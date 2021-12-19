export default (rawInput: string) => {
    const scanners = [];
    for (const scanner of rawInput.split('\n\n')) {
        let beacons: [number, number, number][] = [];

        for (const line of scanner.split('\n')) {
            const res = line.match(/^(-?\d+),(-?\d+),?(-?\d+)?$/);
            if (!res) continue;

            const [_, ...beacon] = res.map(Number)
            beacons.push(beacon.filter(v => !isNaN(v)) as any);
        }

        scanners.push(beacons);
    }

    return [
        1
    ];
};
