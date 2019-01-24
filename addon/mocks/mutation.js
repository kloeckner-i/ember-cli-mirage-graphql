import { contextSet, isFunction, reduceKeys } from '../utils';
import { getRecords } from '../db';

const getMutationMocker = (db, { mutations = {}, varsMap = {} } = {}) =>
  (_, vars, __, { fieldName, returnType }) => {
    let mutation = mutations[fieldName];
    let records = getRecords(db, returnType.name);

    if (isFunction(mutation)) {
      let mappedVars = mapVars(vars, varsMap[returnType.name]);

      records = mutation(records, mappedVars, db);
    }

    return records;
  };

const mapVars = (vars, varsMap = {}) =>
  reduceKeys(vars, (mappedVars, key) =>
    contextSet(mappedVars, resolveVarName(key, varsMap), vars[key]), {});

const resolveVarName = (key, varsMap) => key in varsMap ? varsMap[key] : key;

export default getMutationMocker;
