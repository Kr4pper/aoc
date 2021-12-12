export default (rawInput: string) => {
    type Vertices = {[key: string]: string[];};

    const [START, END] = ['start', 'end'];
    const LAST_UPPERCASE_LETTER = 90; // Z

    const graph: Vertices = rawInput
        .split('\n')
        .map(line => line.split('-'))
        .reduce((acc, [start, end]) => {
            acc[start] = acc[start] || [];
            acc[end] = acc[end] || [];
            acc[start].push(end);
            acc[end].push(start);
            return acc;
        }, {});

    const replaceBigCaves = (edges: Vertices): {[key: string]: string[];} => {
        const newGraph = {};

        const addEdge = (start: string, end: string) => {
            if (end === START) return;

            newGraph[start] = newGraph[start] || [];
            newGraph[start].push(end);
        };

        for (const cave of Object.keys(edges)) {
            if (cave.charCodeAt(0) <= LAST_UPPERCASE_LETTER) continue;

            for (const primary of edges[cave]) {
                if (primary.charCodeAt(0) <= LAST_UPPERCASE_LETTER) {
                    for (const secondary of edges[primary]) addEdge(cave, secondary);
                }
                else addEdge(cave, primary);
            }
        }
        return newGraph;
    };

    const counter = (paths: string[]) => paths.reduce((acc, p) => {
        acc[p] = acc[p] || 0;
        acc[p]++;
        return acc;
    }, {});
    type Weights = {[key: string]: {[key: string]: number;};};
    const weights: Weights = Object.entries(replaceBigCaves(graph)).reduce((acc, [edge, paths]) => ({...acc, [edge]: counter(paths)}), {});

    const crawl = (edges: Weights, start: string, visited: string[], track = []) =>
        start === END
            ? 1
            : Object.entries(edges[start])
                .filter(([end]) => !visited.includes(end))
                .reduce((sum, [end, weight]) => sum + weight * crawl(edges, end, [...visited, end], [...track, start]), 0);

    const advancedCrawl = (edges: Weights, start: string, visited: string[], bonusVisitUsed = false, track = []) =>
        start === END
            ? 1
            : bonusVisitUsed
                ? crawl(edges, start, visited)
                : Object.entries(edges[start])
                    .filter(([end]) => end !== START)
                    .reduce((sum, [end, weight]) => sum + weight * advancedCrawl(edges, end, [...visited, end], visited.includes(end), [...track, start]), 0);

    return [
        crawl(weights, START, []),
        advancedCrawl(weights, START, []),
    ];
};
