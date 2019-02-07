import { camelize, pluralize } from 'ember-cli-mirage/utils/inflector';
import { getMappedFieldName } from './fields/name';

export const getTableName = (typeName) => camelize(pluralize(typeName));

export const composeGetRecords = (getTableName) =>
  (db, typeName) => db[getTableName(typeName)];

export const getRecords = composeGetRecords(getTableName);

// TODO: Add unit test for this
export const composeGetTableNameForField = (getMappedFieldName, getTableName) =>
  (fieldName, parent, typeName, fieldsMap) =>
    getMappedFieldName(fieldName, parent, typeName, fieldsMap) ||
      getTableName(typeName);

export const getTableNameForField =
  composeGetTableNameForField(getMappedFieldName, getTableName);
