import { contextSet, isFunction, reduceKeys, unwrapNonNull } from '../utils';
import { getRecords } from '../db';
import { resolveVarName } from '../filter/vars';

export const composeMapVars = (resolveVarName) =>
  (vars, varsMap = {}) =>
    reduceKeys(vars, (mappedVars, key) =>
      contextSet(mappedVars, resolveVarName(key, varsMap), vars[key]), {});

const mapVars = composeMapVars(resolveVarName);

export const composeMockMutation = (getRecords, mapVars) =>
  (db, options = {}, _, vars, __, { fieldName, returnType }) => {
    returnType = unwrapNonNull(returnType);

    let { mutations = {}, varsMap = {} } = options;
    let mutation = mutations[fieldName];
    let records = getRecords(db, returnType.name);

    if (isFunction(mutation)) {
      let mappedVars = mapVars(vars, varsMap[returnType.name]);

      records = mutation(records, mappedVars, db);
    }

    return records;
  };

const mockMutation = composeMockMutation(getRecords, mapVars);

export default mockMutation;
