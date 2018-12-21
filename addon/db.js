import { camelize, pluralize } from 'ember-cli-mirage/utils/inflector';

const getTableName = (typeName) => pluralize(camelize(typeName));

export const getRecordsByType = (db) =>
  ([fieldNode, typeInfo, getRecords, parent, mappedFieldName]) =>
    [
      fieldNode,
      typeInfo,
      db[mappedFieldName || getTableName(typeInfo.type.name)],
      getRecords,
      parent
    ];
