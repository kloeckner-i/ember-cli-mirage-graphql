import { contextSet, isFunction, reduceKeys, unwrapNonNull } from '../utils';
import { GraphQLList } from 'graphql';
import { getRecords } from '../db';
import { resolveArgName } from '../fields/args';

export const composeMapArgs = (resolveArgName) =>
  (args, argsMap = {}) =>
    reduceKeys(args, (mappedArgs, key) =>
      contextSet(mappedArgs, resolveArgName(key, argsMap), args[key]), {});

const mapArgs = composeMapArgs(resolveArgName);

export const composeMockMutation = (getRecords, mapArgs) =>
  (db, options = {}, _, args, __, { fieldName, returnType }) => {
    returnType = unwrapNonNull(returnType);

    if (returnType instanceof GraphQLList) {
      returnType = returnType.ofType
    }

    let { mutations = {}, argsMap = {} } = options;
    let mutation = mutations[fieldName];
    let records = getRecords(db, returnType.name);

    if (isFunction(mutation)) {
      let mappedArgs = mapArgs(args, argsMap[returnType.name]);

      records = mutation(records, mappedArgs, db);
    }

    return records;
  };

const mockMutation = composeMockMutation(getRecords, mapArgs);

export default mockMutation;
