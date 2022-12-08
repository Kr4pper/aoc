import {Grid2D, Hashtable, range, sortByKeys} from '../utils';

export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const eventRegex = /^\[(\d+)\-(\d+)\-(\d+) (\d+):(\d+)\] \D*(wakes|falls|\d+)/;
    const parseEvent = (line: string) => {
        const [_, year, month, day, hour, minute, action] = line.match(eventRegex);
        return {year, month, day, hour, minute, action};
    };
    const ordered =
        rawInput
            .split('\n')
            .map(parseEvent)
            .sort(sortByKeys(['year', 'month', 'day', 'hour', 'minute']));

    const sleepTimes: Hashtable<number> = {};
    const grid = new Grid2D(Math.max(...[...rawInput.match(/#\d+/g)].map(v => +v.substring(1))) + 1, 60, 0);
    let currentGuard: string;
    let asleepSince: number;
    for (const event of ordered) {
        switch (event.action) {
            case 'falls':
                asleepSince = +event.minute;
                break;
            case 'wakes':
                const wakingUpAfter = +event.minute - 1;
                sleepTimes[currentGuard] = (sleepTimes[currentGuard] || 0) + (wakingUpAfter - asleepSince);
                grid.incrementLine(+currentGuard, asleepSince, +currentGuard, wakingUpAfter);
                break;
            default:
                currentGuard = event.action;
        }
    }

    const sleepiestGuard = +Object.entries(sleepTimes).sort((a, b) => a[1] < b[1] ? 1 : -1)[0][0];
    const sleepiestMinute = (guardId: number) => range(0, 59).map(m => [m, grid.get(guardId, m)]).sort((a, b) => a[1] < b[1] ? 1 : -1)[0];

    return [
        sleepiestGuard * sleepiestMinute(sleepiestGuard)[0],
        Object.keys(sleepTimes).map(guardId => [guardId, ...sleepiestMinute(+guardId)]).sort((a, b) => a[2] < b[2] ? 1 : -1).map(([id, minute]) => +id * +minute)[0],
    ];
};
