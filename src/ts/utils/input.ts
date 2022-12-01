import {Axios} from 'axios';
import {readFileSync} from 'fs';
import {join} from 'path';

export const readInput = (year: string, day: string) =>
    readFileSync(
        join(join(__dirname, '..', '..', 'input', year, day)),
        {encoding: 'utf-8'}
    );

export const fetchInput = (year: string, rawDay: string | number) => new Axios({}).get<string>(
    `https://adventofcode.com/${year}/day/${+rawDay}/input`,
    {headers: {Cookie: `session=${readFileSync(join(__dirname, '..', '..', '..', 'TOKEN'))};`}}
);

export const toDay = (rawDay: string | number) => ('' + rawDay).padStart(2, '0');
