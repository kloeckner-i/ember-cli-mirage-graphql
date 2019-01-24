import { camelize, pluralize } from 'ember-cli-mirage/utils/inflector';

export const getRecords = (db, typeName) => db[getTableName(typeName)];

export const getTableName = (typeName) => camelize(pluralize(typeName));
