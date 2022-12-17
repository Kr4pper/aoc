import {Hashtable} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const valveRegex = /Valve (..) has flow rate=(\d+).*valves? (.*)$/;
    const parseValve = (line: string) => {
        const [_, valveId, flow, exits] = line.match(valveRegex);
        return [valveId, +flow, exits.split(', ')] as const;
    };

    const valves: Hashtable<ReturnType<typeof parseValve>> = rawInput.split('\n').map(parseValve).reduce((acc, v) => ({...acc, [v[0]]: v}), {});
    const valveIds = Object.values(valves).map(v => v[0]);
    const relevantValves = valveIds.filter(id => valves[id][1]);

    const distance: Hashtable<Hashtable<number>> = valveIds.reduce((acc, outer) => ({...acc, [outer]: {}}), {});
    const addEdge = (from: string, to: string) => {
        distance[from][from] = 0;
        distance[from][to] = 1;
        distance[to][from] = 1;
    };
    for (const [id, _, exits] of Object.values(valves)) {
        for (const exit of exits) addEdge(id, exit);
    }

    // Floyd-Warshall fill
    for (const k of valveIds) {
        for (const i of valveIds) {
            if (!distance[i][k]) continue;

            for (const j of valveIds) {
                if (!distance[k][j]) continue;

                distance[i][j] = distance[i][j]
                    ? Math.min(distance[i][j], distance[i][k] + distance[k][j])
                    : distance[i][j] = distance[i][k] + distance[k][j];
            }
        }
    };

    let max = 0;
    let maxPath: string;
    const simulate = (location: string, remainingValves: string[], score: number, turnsLeft: number, path: string) => {
        const reachable = remainingValves.filter(id => distance[location][id] < turnsLeft);
        if (!reachable.length) {
            if (score > max) {
                max = score;
                maxPath = path;
            }
            return;
        }

        for (const target of reachable) {
            const arrivalTime = turnsLeft - (distance[location][target] + 1);
            const nextRemaining = [...remainingValves];
            nextRemaining.splice(nextRemaining.indexOf(target), 1);
            simulate(target, nextRemaining, score + valves[target][1] * arrivalTime, arrivalTime, path + ',' + target);
        }
    };

    const solve = (valves: string[], turns: number) => {
        max = 0;
        simulate('AA', valves, 0, turns, 'AA');
        return max;
    };

    // PART 2
    // relies on human and elephant walking off in different directions, which is not generally true

    return [
        solve(relevantValves, 30),
        solve(relevantValves, 26) + solve(relevantValves.filter(v => !maxPath.split(',').includes(v)), 26),
    ];
};
