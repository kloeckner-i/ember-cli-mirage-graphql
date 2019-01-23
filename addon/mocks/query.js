import Ember from 'ember';
import { createFieldInfo } from '../fields/info/create';
import { resolveFieldInfo } from '../fields/info/resolve';
import { getFieldName } from '../fields/name';
import { getTypeForField } from '../fields/type';
import { partial } from '../utils';

/*
  TODO

  * Investigate GraphQL Tools' ability to get types from the schema
 */
const getMockQuery = (db, options, resolvers) =>
  (_, vars, __, { fieldNodes, returnType, schema }) => {
    try {
      let getType = partial(getTypeForField, schema._typeMap);
      let [rootField] = fieldNodes;
      let fieldName = getFieldName(rootField);
      let fieldInfo = {
        [fieldName]: createFieldInfo(rootField, fieldName, returnType, getType, resolvers)
      };
      let records = resolveFieldInfo(fieldInfo, db, vars, options, resolvers);

      return records;
    } catch(ex) {
      Ember.Logger.error(ex);
    }
  };

export default getMockQuery;
