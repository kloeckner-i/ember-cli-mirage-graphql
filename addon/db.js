import { camelize, pluralize } from 'ember-cli-mirage/utils/inflector';

export const getRecordsByType = (db) =>
  ([fieldNode, typeInfo, getRecords, parent, mappedFieldName]) =>
    [
      fieldNode,
      typeInfo,
      db[mappedFieldName || pluralize(camelize(typeInfo.type.name))],
      getRecords,
      parent
    ];
