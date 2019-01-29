export function contextPush(context, k, v) {
  context[k].push(v);

  return context;
}

export function contextSet(context, k, v) {
  context[k] = v;

  return context;
}

export const ensureList = (item) => item == null
  ? []
  : item instanceof Array
    ? item
    : [item];

export const getFirstKey = (obj) => Object.keys(obj)[0];

export const isFunction = (obj) => obj != null && typeof obj === 'function';

export const partial = (fn, ...args1) => (...args2) => fn(...args1, ...args2);

export const pipeWithMeta = (...fns) =>
  fns.reduce((fn1, fn2) => (arg, meta) => fn2(fn1(arg, meta), meta));

export const reduceKeys = (obj, reducerFn, defaultValue) =>
  Object.keys(obj).reduce(reducerFn, defaultValue);
