import {countReset} from 'console';

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
            //if (start === end) return;

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
    const weights: {[key: string]: {[key: string]: number;};} = Object.entries(replaceBigCaves(graph)).reduce((acc, [edge, paths]) => ({...acc, [edge]: counter(paths)}), {});
    console.log(weights);

    const walk = (
        cavegraph: {[key: string]: {[key: string]: number;};},
        at: string,
        seen: string[],
        visitedTwice = false,
        depth = 0,
        track = []
    ) => {
        if (at === END) {
            console.log('>>', track);
            return 1;
        }

        const addToSeen = !seen.includes(at);
        if (addToSeen) seen.push(at);

        let paths = 0;
        for (const [adj, count] of Object.entries(cavegraph[at])) {
            //console.log('  '.repeat(depth), at, adj, count, seen);
            if (seen.includes(adj)) {
                if (visitedTwice) continue;
                console.log(count);
                paths += count * walk(cavegraph, adj, seen, true, depth + 1, [...track, at]);
            }
            else {
                console.log(count);
                paths += count * walk(cavegraph, adj, seen, visitedTwice, depth + 1, [...track, at]);
            }
        }

        if (addToSeen) seen.pop();
        return paths;
    };

    const visit = (visited: string[], position: string) => position.charCodeAt(0) <= LAST_UPPERCASE_LETTER ? visited : [...visited, position];

    const crawl = (edges: Vertices, start: string, visited: string[], track = []) =>
        start === END
            ? 1
            : edges[start]
                .filter(end => !visited.includes(end)  || end.charCodeAt(0) <= LAST_UPPERCASE_LETTER)
                .reduce((sum, end) => sum + crawl(edges, end, visit(visited, start), [...track, start]), 0);

    const advancedCrawl = (edges: Vertices, start: string, visited: string[], bonusVisitUsed = false, track = []) =>
        start === END
            ? 1
            : bonusVisitUsed
                ? crawl(edges, start, visited)
                : edges[start]
                    .filter(end => end !== START)
                    .reduce((sum, end) => sum + advancedCrawl(edges, end, visit(visited, start), visited.includes(end), [...track, start]), 0);

    return [
        //crawl(graph, START, []),
        advancedCrawl(graph, START, []),
        walk(weights, START, [], true),
    ];
};
