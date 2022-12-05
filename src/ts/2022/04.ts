export default (rawInput: string): [number?, number?] => {
    const assignmentRegex = /^(\d+)-(\d+),(\d+)-(\d+)/;
    const parseAssignment = (line: string) => {
        const matches = line.match(assignmentRegex);
        return [matches[1], matches[2], matches[3], matches[4]].map(a => parseInt(a));
    };

    const assignments = rawInput.split('\n').map(parseAssignment);

    return [
        assignments.filter(([a1, a2, b1, b2]) => (a1 <= b1 && a2 >= b2) || (a1 >= b1 && a2 <= b2)).length, // b in a, or a in b
        assignments.filter(([a1, a2, b1, b2]) => !((a2 < b1) || (a1 > b2))).length, // no overlaps on either left or right
    ];
};
