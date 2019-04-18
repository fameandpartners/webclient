import { isNode } from '@common/utils/server-client-helpers';
import { isArray } from 'util';
import { Timer } from 'typings/timer';

// const performance = isNode() ? require('perf_hooks').performance : window.performance;

export const getFnCallerName = (skip: number = 2) => {
    let fnCallerName = '';

    try {
        throw new Error();
    } catch (e) {
        const re = /(\w+)@|at ([a-zA-Z._]+) \(/gm;
        const st = e.stack;
        const m = st.match(re);
        
        // We don't care about the first two results as they are this function + finish
        if (m && isArray(m) && m.length >= skip) {
            fnCallerName = m[skip];
        }
    }

    return fnCallerName;
};

export const start = (clientOnly: boolean = true) => {
    if (clientOnly && isNode()) { return -1; }
    return performance.now();
};

export const finish = (beginning: number, clientOnly: boolean = true) => {
    if (clientOnly && isNode()) { return; }
    const end = performance.now();
    console.debug(`It has taken: ${getFnCallerName()} ${end - beginning}ms to run`);
};

/**
 * Usage:
 * 
 * const fn = (foo) => debounce(100, bar(foo), (id: any) => setState({ id }), this.state.id)
 * 
 * @param delay 
 * @param fn 
 * @param updateHandlerId 
 * @param handlerId 
 */
export const debounce = (delay: number, fn: () => any, updateHandlerId: (handlerId?: Timer) => void, handlerId?: Timer | null) => {
    if (handlerId) {
        if (isNode()) {
            global.clearTimeout(handlerId as NodeJS.Timer);
        } else {
            window.clearTimeout(handlerId as number);
        }
    }

    let updatedHandlerId;

    if (isNode()) {
        updatedHandlerId = global.setTimeout(() => {
            fn();
            updateHandlerId(undefined);
        }, delay);
    } else {
        updatedHandlerId = window.setTimeout(() => {
            fn();
            updateHandlerId(undefined);
        }, delay);
    }

    if (updateHandlerId) {
        updateHandlerId(updatedHandlerId);
    }
};

// UNTESTED
export const throttled = (lastCall: number, delay: number, fn: () => void, updateLastCall: (lc: number) => void) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
        return;
    }

    updateLastCall(now);
    return fn();
};
