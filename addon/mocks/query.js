import Ember from 'ember';
import createFieldInfo from '../fields/info/create';
import getFieldName from '../fields/name';
import resolveFieldInfo from '../fields/info/resolve';
import { getIsInterface, getTypeForField } from '../fields/type';
import { partial } from '../utils';

// TODO: Add unit test for this
export const composeMockQuery =
  (getFieldName, createFieldInfo, resolveFieldInfo, getIsInterface) =>
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
        Ember.Logger.error(ex);
      }
    };

const mockQuery = composeMockQuery(getFieldName, createFieldInfo,
  resolveFieldInfo, getIsInterface);

export default mockQuery;
