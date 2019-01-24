import Ember from 'ember';
import { GraphQLInterfaceType } from 'graphql';
import { createFieldInfo } from '../fields/info/create';
import { getFieldName } from '../fields/name';
import { getTypeForField } from '../fields/type';
import { partial } from '../utils';
import { resolveFieldInfo } from '../fields/info/resolve';

const getQueryMocker = (db, options) =>
  (_, vars, __, { fieldNodes, returnType, schema }) => {
    try {
      let getType = partial(getTypeForField, schema._typeMap);
      let [rootField] = fieldNodes;
      let fieldName = getFieldName(rootField);
      let fieldInfo = {
        [fieldName]: createFieldInfo(rootField, fieldName, returnType, getType)
      };
      let records = resolveFieldInfo(fieldInfo, db, vars, options);

      return returnType instanceof GraphQLInterfaceType
        ? records
        : records[fieldName];
    } catch(ex) {
      Ember.Logger.error(ex);
    }
  };

export default getQueryMocker;
