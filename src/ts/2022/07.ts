import {add, ascending, Hashtable} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    interface File {
        name: string;
        size: number;
    }
    interface Directory {
        name: string;
        parent: Directory;
        children: Hashtable<Directory>;
        files: Hashtable<File>;
    }

    // PART 1
    const ROOT: Directory = {
        name: '/',
        parent: null,
        children: {},
        files: {},
    };
    ROOT.parent = ROOT;

    let dir: Directory = ROOT;
    const parsers: [RegExp, (match: RegExpMatchArray) => void][] = [
        [
            /^\$ cd \/$/,
            () => {
                dir = ROOT;
            }
        ],
        [
            /^\$ cd \.\.$/,
            () => {
                dir = dir.parent;
            }
        ],
        [
            /^\$ cd (\w+)$/,
            ([_, name]) => {
                dir = dir.children[name];
            }
        ],
        [
            /^\$ ls$/,
            () => {}
        ],
        [
            /^(\d+) (.+)$/,
            ([_, size, name]) => {
                if (!dir.files[name]) {
                    dir.files[name] = {name, size: +size};
                }
            }
        ],
        [
            /^dir (.+)$/,
            ([_, name]) => {
                if (!dir.children[name]) {
                    dir.children[name] = {name, parent: dir, children: {}, files: {}};
                }
            }
        ],
    ];

    const executeInstruction = (line: string) =>
        parsers.find(([regExp, execute]) => {
            const match = line.match(regExp);
            if (match) execute(match);
        });

    rawInput.split('\n').map(executeInstruction);

    // PART 1
    const dirSizes: Hashtable<number> = {};
    const getDirSize = (dir: Directory, path: string): number => {
        const childSize = Object.values(dir.children).reduce((sum, child) => sum + getDirSize(child, path + '/' + child.name), 0);
        const fileSize = Object.values(dir.files).reduce((sum, file) => sum + file.size, 0);

        const totalSize = childSize + fileSize;
        dirSizes[path] = totalSize;
        return totalSize;
    };
    const usedSpace = getDirSize(ROOT, '');

    // PART 2
    const CAPACITY = 70_000_000;
    const MIN_UNUSED = 30_000_000;
    const TO_DELETE = MIN_UNUSED - (CAPACITY - usedSpace);

    return [
        Object.values(dirSizes).filter(v => v <= 100_000).reduce(add, 0),
        Object.values(dirSizes).sort(ascending).find(v => v >= TO_DELETE),
    ];
};
