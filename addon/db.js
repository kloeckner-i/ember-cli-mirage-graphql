import { pluralize } from 'ember-cli-mirage/utils/inflector';

export const getRecordsByType = (db) => (mockInfo) => {
  let records = db[pluralize(mockInfo.mirageType)];

  mockInfo.setRecords(records);

  return mockInfo;
};
