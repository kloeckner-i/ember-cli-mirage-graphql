import { isFunction, reduceKeys } from '../utils';

const getIsRelayNodeField = (fieldName, { isRelayEdges }) =>
  fieldName === 'node' && isRelayEdges;

function getResolvedFieldName(fieldName, typeName, { fieldsMap = {} } = {}) {
  let fieldsMapForType = fieldsMap[typeName];
  let resolvedFieldName = fieldsMapForType && fieldsMapForType[fieldName];

  return !isFunction(resolvedFieldName) && resolvedFieldName || fieldName;
}

const getFieldsReducer = (record, meta) =>
  (mappedRecord, fieldName) => {
    let { db, field, options, resolveFieldInfo, vars } = meta;
    let fieldValue = field.fields[fieldName];
    let fieldInfo = { [fieldName]: fieldValue };
    let resolvedFieldName =
      getResolvedFieldName(fieldName, field.type.name, options);

    // TODO: We're changing state here
    if (fieldValue) {
      fieldValue.parent = { field, record };
    }

    // TODO: We're changing state here
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

const mapFieldsForRecords = (records, meta) =>
  records.map((record) => reduceKeys(meta.field.fields,
    getFieldsReducer(record, meta), {}));

export default mapFieldsForRecords;
