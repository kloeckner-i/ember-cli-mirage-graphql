import { contextSet, getIsList, getTableByType, isFunction } from '../utils';

const mockMutationFn = (db, options = {}) => (root, vars, _, meta) => {
  let { fieldName, returnType } = meta;
  let { records } = getTableByType(db, returnType)
  let { mutations = {}, varsMap = {} } = options;
  let mappedVars = mapVars(vars, varsMap[returnType.name]);

  // TODO: implement some default mutation functionality, if reasonable
  if (isFunction(mutations[fieldName])) {
    records = mutations[fieldName](records, mappedVars, db);
  }

  return getIsList(meta) ? records : records[0];
};

export const mapVars = (vars, varsMap) =>
  Object.keys(vars).reduce((mappedVars, key) =>
    contextSet(mappedVars, key in varsMap ? varsMap[key] : key, vars[key]), {});

export default mockMutationFn;
