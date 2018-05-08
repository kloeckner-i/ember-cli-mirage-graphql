import { GraphQLList } from 'graphql';
import { get } from '@ember/object';
import { pluralize } from 'ember-cli-mirage/utils/inflector';

const RELATED_PROP = 'type.ofType.astNode';

export function getRelatedRecords(records, type, fields, fieldsMap, db) {
  let relatedFields = getRelatedFields(fields).map(mapRelatedFields(fieldsMap));
  let recordsWithRelatedData = [];

  records.forEach((record) => {
    let recordCopy = Object.assign({}, record);

    relatedFields.forEach(({ fieldName, mappedFieldName, isList }) =>
      recordCopy[fieldName] = mappedFieldName in record
        ? record[mappedFieldName]
        : lookUpRelatedRecords(db, mappedFieldName, isList, record, type));

    recordsWithRelatedData.push(recordCopy);
  });

  return recordsWithRelatedData;
}

const getRelatedFields = (fields) =>
  Object.keys(fields).reduce(reduceFieldsToRelatedFields(fields), []);

const reduceFieldsToRelatedFields = (fields) => (relatedFields, fieldName) => {
  let field = fields[fieldName];

  return get(field, RELATED_PROP) ? [...relatedFields, field] : relatedFields;
};

const mapRelatedFields = (fieldsMap) => ({ name: relatedField, type }) => ({
  fieldName: relatedField,
  mappedFieldName: mapRelatedField(relatedField, fieldsMap),
  isList: type instanceof GraphQLList
});

const mapRelatedField = (field, map) => field in map ? map[field] : field;

const filterRelatedByRecord = (table, record, type) =>
  table.filter((related) => related[type].id === record.id);

function lookUpRelatedRecords(db, fieldName, isList, record, type) {
  let tableName = isList ? fieldName : pluralize(fieldName);
  let relatedRecords = filterRelatedByRecord(db[tableName], record, type);

  return isList ? relatedRecords : relatedRecords[0];
}
