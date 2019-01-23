import { getFieldName } from './field-utils';
import { isFunction, reduceKeys } from '../utils';
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

const getIsRelayNodeField = (fieldName, { isRelayEdges }) =>
  fieldName === 'node' && isRelayEdges;

function getResolvedFieldName(fieldName, typeName, { fieldsMap } = {}) {
  let fieldsMapForType = fieldsMap[typeName];
  let resolvedFieldName = fieldsMapForType && fieldsMapForType[fieldName];

  return !isFunction(resolvedFieldName) && resolvedFieldName || fieldName;
}

const getFieldsReducer = (record, field, db, vars, options) =>
  (mappedRecord, fieldName) => {
    let fieldValue = field.fields[fieldName];
    let fieldInfo = { [fieldName]: fieldValue };
    let resolvedFieldName =
      getResolvedFieldName(fieldName, field.type.name, options);

    if (fieldValue) {
      fieldValue.parent = { field, record };
    }

    if (getIsRelayNodeField(fieldName, field)) {
      fieldValue.relayNode = record.node;
    }

    mappedRecord[fieldName] = fieldValue
      ? resolveFieldInfo(fieldInfo, db, vars, options)[fieldName]
      : fieldName === '__typename'
        ? field.type.name
        : record[resolvedFieldName];

    return mappedRecord;
  };

export const mapFieldsForRecords = (records, field, db, vars, options) =>
  records.map((record) => reduceKeys(field.fields,
    getFieldsReducer(record, field, db, vars, options), {}));
