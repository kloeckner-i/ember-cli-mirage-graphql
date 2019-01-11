const pipeReducer = (f, g) => (...args) => g(f(...args));

export const isFunction = (obj) => obj != null && typeof obj === 'function';

export const partial = (fn, ...args1) => (...args2) => fn(...args1, ...args2);

export const pipe = (...fns) => fns.reduce(pipeReducer);

export const reduceKeys = (obj, reducerFn, defaultValue) =>
  Object.keys(obj).reduce(reducerFn, defaultValue);

export function contextSet(obj, k, v) {
  obj[k] = v;

  return obj;
}
