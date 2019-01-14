import { getFieldName } from './field-utils';
import { isFunction } from '../utils';
import { resolveFieldInfo } from './info/resolve';

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

const getFieldsReducer = (record, field, db, vars, options, meta) =>
  (mappedRecord, fieldName) => {
    let fieldValue = field[fieldName];

    mappedRecord[fieldName] = fieldValue
      ? resolveFieldInfo(fieldValue, db, vars, options, meta)
      : record[fieldName];

    return mappedRecord;
  };

export const mapFieldsForRecords = (records, field, db, vars, options, meta) =>
  records.map((record) =>
    Object.keys(field.fields)
      .reduce(getFieldsReducer(record, field, db, vars, options, meta), {}));
