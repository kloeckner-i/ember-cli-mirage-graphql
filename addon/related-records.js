import { GraphQLList } from 'graphql';
import { get } from '@ember/object';
import { pluralize } from 'ember-cli-mirage/utils/inflector';

const RELATED_PROP = 'type.ofType.astNode';

export const getRelatedRecords = (db, { fieldsMap } = {}) =>
  (mockInfo) => {
    let { records, mirageType, type } = mockInfo;
    let recordsWithRelatedData = [];
    let relatedFields = getRelatedFieldsForType(type, fieldsMap);

    records.forEach(
      getRelatedData(db, recordsWithRelatedData, relatedFields, mirageType)
    );

    mockInfo.setRecords(recordsWithRelatedData);

    return mockInfo;
  };

const filterRelatedByRecord = (table, record, type) =>
  table.filter((related) => related[type] && related[type].id === record.id);

const getRelatedData = (db, records, relatedFields, mirageType) =>
  (record) => {
    let recordCopy = Object.assign({}, record);

    relatedFields.forEach(
      getRelatedRecordsForField(db, record, recordCopy, mirageType)
    );

    records.push(recordCopy);
  };

const getRelatedFields = (fields) =>
  Object.keys(fields).reduce(reduceFieldsToRelatedFields(fields), []);

const getRelatedRecordsForField = (db, record, recordCopy, mirageType) =>
  ({ fieldName, mappedFieldName, isList }) =>
    recordCopy[fieldName] = mappedFieldName in record
      ? record[mappedFieldName]
      : lookUpRelatedRecords(db, mappedFieldName, isList, record, mirageType);

const mapRelatedField = (field, map) => field in map ? map[field] : field;

const mapRelatedFields = (fieldsMap) => ({ name: relatedField, type }) => ({
  fieldName: relatedField,
  mappedFieldName: mapRelatedField(relatedField, fieldsMap),
  isList: type instanceof GraphQLList
});

const reduceFieldsToRelatedFields = (fields) => (relatedFields, fieldName) => {
  let field = fields[fieldName];

  return get(field, RELATED_PROP) ? [...relatedFields, field] : relatedFields;
};

function getRelatedFieldsForType(type, fieldsMap = {}) {
  let { _fields: fields } = type;
  let fieldsMapForType = fieldsMap[type.name];

  return getRelatedFields(fields).map(mapRelatedFields(fieldsMapForType));
}

function lookUpRelatedRecords(db, fieldName, isList, record, type) {
  let relatedTable = isList ? fieldName : pluralize(fieldName);
  let relatedRecords = filterRelatedByRecord(db[relatedTable], record, type);

  return isList ? relatedRecords : relatedRecords[0];
}
