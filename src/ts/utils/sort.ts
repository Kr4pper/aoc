import {Hashtable} from './hashtable';

/**
 * Sort tables by list of priority keys
 */
export const sortByKeys = <T extends Hashtable<any>>(priority: (keyof T)[]) => (a: T, b: T) => {
    const diff = priority.find(key => a[key] !== b[key]);
    return a[diff] > b[diff] ? 1 : -1;
};
