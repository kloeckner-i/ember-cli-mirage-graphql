import Ember from 'ember';
import createFieldInfo from '../fields/info/create';
import resolveFieldInfo from '../fields/info/resolve';
import { GraphQLInterfaceType } from 'graphql';
import { getFieldName } from '../fields/name';
import { getTypeForField } from '../fields/type';
import { partial } from '../utils';

// TODO: Compose this function
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
