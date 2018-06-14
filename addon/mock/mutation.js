import { GraphQLList } from 'graphql';
import { camelize, pluralize } from 'ember-cli-mirage/utils/inflector';
import { contextSet, isFunction } from '../utils';

const mockMutationFn = (db, options = {}) => (root, vars, _, meta) => {
  let { fieldName, returnType } = meta;
  let { name: typeName } = returnType;
  let records = db[camelize(pluralize(typeName))];
  let { mutations = {}, varsMap = {} } = options;
  let mappedVars = mapVars(vars, varsMap[typeName]);

  // TODO: implement some default mutation functionality, if reasonable
  if (isFunction(mutations[fieldName])) {
    records = mutations[fieldName](records, mappedVars, db);
  }

  return returnType instanceof GraphQLList ? records : records[0];
};

export const mapVars = (vars, varsMap = {}) =>
  Object.keys(vars).reduce((mappedVars, key) =>
    contextSet(mappedVars, key in varsMap ? varsMap[key] : key, vars[key]), {});

export default mockMutationFn;
