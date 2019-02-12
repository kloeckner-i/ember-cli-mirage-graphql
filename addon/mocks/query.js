import Ember from 'ember';
import createFieldInfo from '../fields/info/create';
import getFieldName from '../fields/name';
import resolveFieldInfo from '../fields/info/resolve';
import { getIsInterface, getTypeForField } from '../fields/type';
import { partial } from '../utils';

export const composeMockQuery =
  (getTypeForField, getFieldName, createFieldInfo, resolveFieldInfo, getIsInterface, logError) =>
    (db, options, _, vars, __, { fieldNodes, returnType, schema }) => {
      try {
        let getType = partial(getTypeForField, schema._typeMap);
        let [rootField] = fieldNodes;
        let fieldName = getFieldName(rootField);
        let fieldInfo = {
          [fieldName]: createFieldInfo(rootField, fieldName, returnType, getType)
        };
        let records = resolveFieldInfo(fieldInfo, db, vars, options);

        return getIsInterface(returnType) ? records : records[fieldName];
      } catch(ex) {
        logError(ex);
      }
    };

const mockQuery = composeMockQuery(getTypeForField, getFieldName,
  createFieldInfo, resolveFieldInfo, getIsInterface, Ember.Logger.error);

export default mockQuery;
