import Ember from 'ember';
import { GraphQLList } from 'graphql';
import { createFieldInfo } from '../fields/info/create';
import { getFieldName } from '../fields/name';
import { getTypeForField } from '../fields/type';
import { partial } from '../utils';
import { resolveFieldInfo } from '../fields/info/resolve';

const { Logger } = Ember;

/*
  TODO

  * Fix issues with belongsTo test
  * Fix issues with mutations test
  * Investigate GraphQL Tools' ability to get types from the schema
 */
const getMockQuery = (db, options, resolvers) =>
  (_, vars, __, { fieldNodes, returnType, schema }) => {
    try {
      // TODO: Don't use partial, it's confusing
      let getType = partial(getTypeForField, schema._typeMap);
      let [rootField] = fieldNodes;
      let fieldName = getFieldName(rootField);
      let fieldInfo = {
        [fieldName]: createFieldInfo(rootField, fieldName, returnType, getType, resolvers)
      };
      let records = resolveFieldInfo(fieldInfo, db, vars, options, resolvers);

      return returnType instanceof GraphQLList ? records[fieldName] : records;
    } catch(ex) {
      Logger.error(ex);
    }
  };

export default getMockQuery;
