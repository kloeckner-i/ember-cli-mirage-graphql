import Ember from 'ember';
import createFieldInfo from '../fields/info/create';
import resolveFieldInfo from '../fields/info/resolve';
import { getFieldNameAndAlias } from '../fields/name';
import { getIsInterface, getTypeForField } from '../fields/type';
import { partial } from '../utils';

export const composeMockQuery =
  (getTypeForField, getFieldNameAndAlias, createFieldInfo, resolveFieldInfo, getIsInterface, logError) =>
    (db, options, _, __, ___, info) => {
      const { fieldNodes, fragments, returnType, schema, variableValues } = info;

      try {
        let getType = partial(getTypeForField, schema._typeMap);
        let [rootField] = fieldNodes;
        let { fieldAlias, fieldName } = getFieldNameAndAlias(rootField);
        let fieldInfoName = fieldAlias || fieldName;
        let isInterface = getIsInterface(returnType)
        let rootFieldName = isInterface ? fieldInfoName : fieldName;
        let fieldInfo = {
          [rootFieldName]: createFieldInfo(rootField, fieldInfoName, returnType,
            fragments, getType)
        };
        let records = resolveFieldInfo(fieldInfo, db, variableValues, options);

        return isInterface ? records : records[fieldName];
      } catch(ex) {
        logError(ex);

        return ex;
      }
    };

const mockQuery = composeMockQuery(getTypeForField, getFieldNameAndAlias,
  createFieldInfo, resolveFieldInfo, getIsInterface, Ember.Logger.error);

export default mockQuery;
