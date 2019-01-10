import { getFieldName } from './field-utils';
import { isFunction } from '../utils';

const getHasFieldsMapFn = (fieldsMap, fieldName) =>
  fieldsMap && fieldName in fieldsMap && isFunction(fieldsMap[fieldName]);

export const maybeMapFieldByFunction = (db, { fieldsMap = {} } = {}) =>
  ([fieldNode, typeInfo, records, parent]) => {
    let _fieldsMap = fieldsMap;
    let fieldName = getFieldName(fieldNode);

    if (parent) {
      _fieldsMap = fieldsMap[parent.type.name];
    }

    records = getHasFieldsMapFn(_fieldsMap, fieldName)
      ? _fieldsMap[fieldName](records, db, parent)
      : records;

    return [typeInfo, records];
  };
