import { getNodeField } from '../relay/node';
import { getTableNameForField } from '../db';

const composeGetRecordsByFieldName = (getNodeField, getTableNameForField) =>
  (fieldName, field, db, options) => {
    let { fieldsMap = {} } = options || {};
    let nodeField = getNodeField(fieldName, field);
    let typeName = (nodeField || field).type.name;
    let tableName = getTableNameForField(fieldName, field.parent, typeName, fieldsMap);
    let table = db[tableName] || [{}];

    return table.slice(0);
  };

const getRecordsByFieldName =
  composeGetRecordsByFieldName(getNodeField, getTableNameForField);

// TODO: Add unit test for this
const composeGetRecordsByField = (getRecordsByFieldName) =>
  (records, { db, field, fieldName, options }) => {
    records = field.relayNode
      ? [field.relayNode]
      : field.relayPageInfo
        ? [field.relayPageInfo]
        : getRecordsByFieldName(fieldName, field, db, options);

    return records;
  };

export const getRecordsByField = composeGetRecordsByField(getRecordsByFieldName);
