import {readFileSync} from 'fs';
import {join} from 'path';

export const readInput = (fileName: string) => readFileSync(
    join(__dirname, '..', 'input', fileName),
    {encoding: 'utf-8'}
);
