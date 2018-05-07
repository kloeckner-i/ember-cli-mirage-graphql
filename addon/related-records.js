import { get } from '@ember/object';

const PROP_FOR_RELATED_FIELDS = 'type.ofType.astNode';

export function getRelatedRecords(records, type, fields, fieldsMap, db) {
  let relatedFields = getRelatedFields(fields);
  let relatedTables = getRelatedTables(relatedFields, fieldsMap, db);

  if (relatedTables.length) {
    records.forEach((record) =>
      relatedTables.forEach(([field, table]) =>
        record[field] = filterRelatedByRecord(table, record, type)));
  }
}

const getRelatedFields = (fields) =>
  Object.keys(fields).reduce(reduceFieldsToRelatedFields(fields), []);

const reduceFieldsToRelatedFields = (fields) => (relatedFields, fieldName) => {
  let field = fields[fieldName];

  return get(field, PROP_FOR_RELATED_FIELDS)
    ? [...relatedFields, field]
    : relatedFields;
};

const getRelatedTables = (fields, fieldsMap, db) =>
  fields.map(mapFieldName(fieldsMap, db));

const mapFieldName = (fieldsMap, db) => ({ name }) =>
  [name, db[mapField(name, fieldsMap)]];

const mapField = (name, map) => name in map ? map[name] : name;

const filterRelatedByRecord = (table, record, type) =>
  table.filter((related) => related[type].id === record.id);
