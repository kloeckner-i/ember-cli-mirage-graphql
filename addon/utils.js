const pipeReducer = (f, g) => (...args) => g(f(...args));

export function cutKey(obj, k) {
  let v = obj[k];

  obj[k] = null;

  return v;
}

export const ensureList = (item) => !item
  ? []
  : item instanceof Array
    ? item
    : [item];

export const isFunction = (obj) => obj != null && typeof obj === 'function';

export const partial = (fn, ...args1) => (...args2) => fn(...args1, ...args2);

export const pipe = (...fns) => fns.reduce(pipeReducer);

export const reduceKeys = (obj, reducerFn, defaultValue) =>
  Object.keys(obj).reduce(reducerFn, defaultValue);

export function contextPush(context, k, v) {
  context[k].push(v);

  return context;
}

export function contextSet(context, k, v) {
  context[k] = v;

  return context;
}
