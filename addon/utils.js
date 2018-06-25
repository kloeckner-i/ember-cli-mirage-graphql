import { GraphQLList } from 'graphql';

export const isFunction = (obj) => obj != null && typeof obj === 'function';

export const maybeUnwrapSingleRecord = ({ records, returnType }) =>
  returnType instanceof GraphQLList ? records : records[0];

export const pipe = (...fns) => fns.reduce(pipeReducer);

export function contextSet(obj, k, v) {
  obj[k] = v;

  return obj;
}

const pipeReducer = (f, g) => (...args) => g(f(...args));
