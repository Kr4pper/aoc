export default (rawInput: string) => {
    type Vertices = {[key: string]: string[];};

    const edges: Vertices = rawInput
        .split('\n')
        .map(line => line.split('-'))
        .reduce((acc, [start, end]) => {
            acc[start] = acc[start] || [];
            acc[end] = acc[end] || [];
            acc[start].push(end);
            acc[end].push(start);
            return acc;
        }, {});

    const [START, END] = ['start', 'end'];
    const MAX_UPPER_CASE = 90; // Z

    const visit = (visited: string[], position: string) => position.charCodeAt(0) <= MAX_UPPER_CASE ? visited : [...visited, position];

    const crawl1 = (edges: Vertices, start: string, visited: string[]) => {
        if (start === END) return 1;

        return edges[start]
            .filter(end => !visited.includes(end) || end.charCodeAt(0) <= MAX_UPPER_CASE)
            .reduce((sum, end) => sum + crawl1(edges, end, visit(visited, start)), 0);
    };

    const crawl2 = (edges: Vertices, start: string, visited: string[], bonusVisitUsed = false) => {
        if (start === END) return 1;

        if (bonusVisitUsed) {
            return edges[start]
                .filter(end => !visited.includes(end) || end.charCodeAt(0) <= MAX_UPPER_CASE)
                .reduce((sum, end) => sum + crawl1(edges, end, visit(visited, start)), 0);
        }

        return edges[start]
            .filter(end => end !== START)
            .reduce((sum, end) => sum + crawl2(edges, end, visit(visited, start), visited.includes(end)), 0);
    };

    return [
        crawl1(edges, START, []),
        crawl2(edges, START, []),
    ];
};
