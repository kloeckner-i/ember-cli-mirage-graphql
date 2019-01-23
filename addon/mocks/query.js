import Ember from 'ember';
import { GraphQLInterfaceType } from 'graphql';
import { createFieldInfo } from '../fields/info/create';
import { getFieldName } from '../fields/name';
import { getTypeForField } from '../fields/type';
import { partial } from '../utils';
import { resolveFieldInfo } from '../fields/info/resolve';

const getMockQuery = (db, options) =>
  (_, vars, __, { fieldNodes, returnType, schema }) => {
    try {
      // TODO: Don't use partial, it's confusing
      let getType = partial(getTypeForField, schema._typeMap);
      let [rootField] = fieldNodes;
      let fieldName = getFieldName(rootField);
      let fieldInfo = {
        [fieldName]: createFieldInfo(rootField, fieldName, returnType, getType)
      };
      let records = resolveFieldInfo(fieldInfo, db, vars, options);

      // TODO: Figure out why this is needed
      return returnType instanceof GraphQLInterfaceType
        ? records
        : records[fieldName];
    } catch(ex) {
      Ember.Logger.error(ex);
    }
  };

export default getMockQuery;
