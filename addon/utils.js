import { GraphQLNonNull } from 'graphql';

const sortEdgesKeysBeforePageInfo = (list) => list.sort();

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

export const getUnionField = (type, fieldName) => {
  for (const t of type._types) {
    if (t._fields[fieldName]) {
      return t._fields[fieldName];
    }
  }
}

export const isFunction = (obj) => obj != null && typeof obj === 'function';

export const objectOfType = (obj, typeName) =>
  Object.assign({ __typename: typeName }, obj);

export const partial = (fn, ...args1) => (...args2) => fn(...args1, ...args2);

export const pipeWithMeta = (...fns) =>
  fns.reduce((fn1, fn2) => (arg, meta) => fn2(fn1(arg, meta), meta));

export const composeReduceKeys = (sortKeys) =>
  (obj, reducerFn, defaultValue) =>
    sortKeys(Object.keys(obj)).reduce(reducerFn, defaultValue);

export const reduceKeys = composeReduceKeys(sortEdgesKeysBeforePageInfo);

export const unwrapNonNull = (type) => type instanceof GraphQLNonNull ? type.ofType : type;
