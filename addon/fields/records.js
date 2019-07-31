import { getNodeField } from '../relay/node';
import { getTableNameForField } from '../db';
import { unwrapNonNull } from '../utils';

export const composeGetRecordsByFieldName = (getNodeField, getTableNameForField) =>
  (fieldName, field, db, options = {}) => {
    let { fieldsMap = {} } = options;
    let nodeField = getNodeField(fieldName, field);
    let typeName = unwrapNonNull((nodeField || field).type).name;
    let tableName = getTableNameForField(fieldName, field.parent, typeName, fieldsMap);
    let table = db[tableName] || [{}];

    return table.slice(0);
  };

const getRecordsByFieldName =
  composeGetRecordsByFieldName(getNodeField, getTableNameForField);

export const composeGetRecordsByField = (getRecordsByFieldName) =>
  (_, { db, field, fieldName, options }) => {
    let records = field.relayNode
      ? [field.relayNode]
      : field.relayPageInfo
        ? [field.relayPageInfo]
        : getRecordsByFieldName(fieldName, field, db, options);

    return records;
  };

export const getRecordsByField = composeGetRecordsByField(getRecordsByFieldName);
