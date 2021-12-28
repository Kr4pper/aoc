import {Hashtable} from '../utils';

export default (rawInput: string) => {
    type Vertices = Hashtable<string[]>;
    type Weights = Hashtable<Hashtable<number>>;

    const [START, END] = ['start', 'end'];
    const LAST_UPPERCASE_LETTER = 90; // Z

    const vertices: Vertices = rawInput
        .split('\n')
        .map(line => line.split('-'))
        .reduce((acc, [start, end]) => {
            acc[start] = acc[start] || [];
            acc[end] = acc[end] || [];
            acc[start].push(end);
            acc[end].push(start);
            return acc;
        }, {} as Vertices);

    const replaceBigCaves = (vertices: Vertices): Vertices => {
        const newGraph = {} as Vertices;

        const addEdge = (from: string, to: string) => {
            if (to === START) return;

            newGraph[from] = newGraph[from] || [];
            newGraph[from].push(to);
        };

        for (const cave of Object.keys(vertices)) {
            if (cave.charCodeAt(0) <= LAST_UPPERCASE_LETTER) continue;

            for (const primary of vertices[cave]) {
                if (primary.charCodeAt(0) <= LAST_UPPERCASE_LETTER) {
                    for (const secondary of vertices[primary]) addEdge(cave, secondary);
                }
                else addEdge(cave, primary);
            }
        }

        return newGraph;
    };

    const counter = (paths: string[]) => paths.reduce((acc, p) => {
        acc[p] = (acc[p] || 0) + 1;
        return acc;
    }, {} as Hashtable<number>);

    const weights: Weights = Object.entries(replaceBigCaves(vertices)).reduce((acc, [edge, paths]) => ({...acc, [edge]: counter(paths)}), {});

    const crawl = (weights: Weights, from: string, visited: string[]): number =>
        from === END
            ? 1
            : Object.entries(weights[from])
                .filter(([end]) => !visited.includes(end))
                .reduce((sum, [end, weight]) => sum + weight * crawl(weights, end, [...visited, end]), 0);

    const advancedCrawl = (weights: Weights, from: string, visited: string[], bonusVisitUsed = false): number =>
        from === END
            ? 1
            : bonusVisitUsed
                ? crawl(weights, from, visited)
                : Object.entries(weights[from])
                    .filter(([end]) => end !== START)
                    .reduce((sum, [end, weight]) => sum + weight * advancedCrawl(weights, end, [...visited, end], visited.includes(end)), 0);

    return [
        crawl(weights, START, []),
        advancedCrawl(weights, START, []),
    ];
};
