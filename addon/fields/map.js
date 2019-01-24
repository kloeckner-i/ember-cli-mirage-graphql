import { isFunction, reduceKeys } from '../utils';
import { resolveFieldInfo } from './info/resolve';

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

export function mapFieldsForRecords(records, { db, field, options, vars }) {
  records = records.map((record) => reduceKeys(field.fields,
    getFieldsReducer(record, field, db, vars, options), {}));

  return records;
}
