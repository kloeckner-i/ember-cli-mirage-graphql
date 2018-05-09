import {
  filterRecordsByMappedField,
  filterRecordsByVars
} from './filter-records';
import { getRelatedRecords } from './related-records';
import { camelize, pluralize } from 'ember-cli-mirage/utils/inflector';
import { get } from '@ember/object';

const PROP_FOR_TYPE = 'returnType';
const PROP_FOR_LIST_TYPE = `${PROP_FOR_TYPE}.ofType`;

export function createMocksForSchema(schema, db, varsMap, fieldsMap) {
  let mockFields = {};
  let rootFieldsToMock = Object.keys(schema._queryType._fields);

  rootFieldsToMock.forEach(mockField(mockFields, db, varsMap, fieldsMap));

  return { RootQueryType: () => mockFields };
}

const mockField = (mockFields, db, varsMap, fieldsMap) => (field) =>
  mockFields[field] = mockFn(db, varsMap, fieldsMap);

const mockFn = (db, varsMap, fieldsMap = {}) => (root, vars, _, meta = {}) => {
  let isList = getIsList(meta);
  let type = getTypeFromMeta(meta, isList);
  let { _fields: fields } = type;
  let typeName = camelize(type.name);
  let records = db[pluralize(typeName)];

  records = filterRecordsByVars(records, vars, varsMap[type]);
  records = getRelatedRecords(records, typeName, fields, fieldsMap[type], db);
  records = filterRecordsByMappedField(records, meta.fieldName, fieldsMap);

  return isList ? records : records[0];
};

const getIsList = (meta) => !!get(meta, PROP_FOR_LIST_TYPE);

const getTypeFromMeta = (meta, isList) =>
  get(meta, isList ? PROP_FOR_LIST_TYPE : PROP_FOR_TYPE);
