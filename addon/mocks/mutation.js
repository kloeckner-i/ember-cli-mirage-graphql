import { contextSet, isFunction, reduceKeys, unwrapNonNull } from '../utils';
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

    let { mutations = {}, argsMap = {} } = options;
    let mutation = mutations[fieldName];
    let records = getRecords(db, returnType.name);

    if (isFunction(mutation)) {
      if(returnType.name) {
        let stringArgsMap = Object.keys(argsMap[returnType.name]).reduce((returnTypeArgsMap, arg) => {
          if(typeof argsMap[returnType.name][arg] === "string") {
            returnTypeArgsMap[arg] = argsMap[returnType.name][arg]
          }
          return returnTypeArgsMap
        }, {})
        let mappedArgs = mapArgs(args, stringArgsMap);

        records = mutation(records, mappedArgs, db);
      } else {
        records = mutation(records, undefined, db);
      }
    }

    return records;
  };

const mockMutation = composeMockMutation(getRecords, mapArgs);

export default mockMutation;
