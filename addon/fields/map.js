import { getIsRelayNodeField } from '../relay/node';
import { isFunction, reduceKeys } from '../utils';
import { resolveFieldName } from './name';

const getFieldsReducer = (resolveFieldName, getIsRelayNodeField, record, meta) =>
  (mappedRecord, fieldName) => {
    let { db, field, options, resolveFieldInfo, vars } = meta;
    let fieldValue = field.fields[fieldName];
    let fieldInfo = { [fieldName]: fieldValue };
    let resolvedFieldName = resolveFieldName(fieldName, field.type.name, options);

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
        : record[!isFunction(resolvedFieldName) && resolvedFieldName || fieldName];

    return mappedRecord;
  };

export const getFieldsForRecordsMapper = (resolveFieldName, getIsRelayNodeField) =>
  (records, meta) =>
    records.map((record) => reduceKeys(meta.field.fields,
      getFieldsReducer(resolveFieldName, getIsRelayNodeField, record, meta), {}));

const mapFieldsForRecords = getFieldsForRecordsMapper(resolveFieldName,
  getIsRelayNodeField);

export default mapFieldsForRecords;
