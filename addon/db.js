import { camelize, pluralize } from 'ember-cli-mirage/utils/inflector';

export const getRecordsByType = (db) => (mockQueryInfo) => {
  let records = db[pluralize(mockQueryInfo.mirageType)];

  mockQueryInfo.setRecords(records);

  return mockQueryInfo;
};

export function getTableName(mockQueryInfo) {
  let { type } = mockQueryInfo;
  let typeName = getTypeName(type);

  mockQueryInfo.setMirageType(camelize(typeName));

  return mockQueryInfo;
}

const getTypeName = (type) => 'ofType' in type ? type.ofType.name : type.name;
