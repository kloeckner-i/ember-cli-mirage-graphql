import { isFunction, reduceKeys } from '../utils';

const getIsRelayNodeField = (fieldName, { isRelayEdges }) =>
  fieldName === 'node' && isRelayEdges;

function getResolvedFieldName(fieldName, typeName, { fieldsMap = {} } = {}) {
  let fieldsMapForType = fieldsMap[typeName];
  let resolvedFieldName = fieldsMapForType && fieldsMapForType[fieldName];

  return !isFunction(resolvedFieldName) && resolvedFieldName || fieldName;
}

const getFieldsReducer = (record, field, fieldResolver, db, vars, options) =>
  (mappedRecord, fieldName) => {
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
      ? fieldResolver(fieldInfo, db, vars, options)[fieldName]
      : fieldName === '__typename'
        ? field.type.name
        : record[resolvedFieldName];

    return mappedRecord;
  };

export const getMapperForRecordFields = (fieldResolver) =>
  (records, { db, field, options, vars }) =>
    records.map((record) => reduceKeys(field.fields,
      getFieldsReducer(record, field, fieldResolver, db, vars, options), {}));
