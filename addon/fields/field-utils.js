import { camelize } from 'ember-cli-mirage/utils/inflector';
import { get } from '@ember/object';

const reduceBySelectedFields = (record, fieldsHash) =>
  (recordCopy, key) => {
    if (key in fieldsHash) {
      recordCopy[key] = record[key];
    }

    return recordCopy;
  };

const reduceSelections = (hash, { name }) => {
  if (name.value !== '__typename') {
    hash[name.value] = true;
  }

  return hash;
};

export const getFieldName = ({ alias = {}, name = {}}) =>
  get(alias, 'value') || get(name, 'value');

export const getRecordInfo = (record, type, fieldName, parent, meta) =>
  ({ fieldName, meta, name: camelize(type.name), parent, record, type });

export function getSelectedFields(record, selections) {
  let fieldsHash = selections.reduce(reduceSelections, {});
  let recordCopy = Object.keys(record)
    .reduce(reduceBySelectedFields(record, fieldsHash), {});

  return recordCopy;
}

export const getSelectedFieldsForList = (records, selections) =>
  records.map((record) => getSelectedFields(record, selections));

export const getTypeForField = (field, { _fields }) => _fields[field].type;
