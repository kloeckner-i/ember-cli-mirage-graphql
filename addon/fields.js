import { camelize } from 'ember-cli-mirage/utils/inflector';
import { get } from '@ember/object';
import { isFunction } from './utils';

const flattenSelection = (selections, type, fieldsMap = {}, options) =>
  (selection) => {
    let { kind, name = {}, selectionSet } = selection;
    let { value: fieldName } = name;
    let isInlineFragment = kind === 'InlineFragment';

    if ((kind === 'Field' || isInlineFragment) && fieldName !== '__typename') {
      selections.data = selections.data.concat(
        isInlineFragment
          ? flattenSelections(selectionSet.selections, type, options)
          : [{
              field: fieldName,
              mappedField: (fieldsMap[fieldName] || fieldName),
              selection
            }]
      );
    }
  };

const getFieldName = ({ alias = {}, name = {}}) =>
  get(alias, 'value') || get(name, 'value');

const getRecordInfo = (record, type, parent, meta) =>
  ({ meta, name: camelize(type.name), parent, record, type });

const getTypeForField = (field, { _fields }) => _fields[field].type;

export const maybeMapFieldByFunction = (db, { fieldsMap = {} } = {}) =>
  ([fieldNode, typeInfo, records, parent]) => {
    let _fieldsMap = fieldsMap;
    let fieldName = getFieldName(fieldNode);

    if (parent) {
      _fieldsMap = fieldsMap[parent.type.name];
    }

    records = fieldName in _fieldsMap && isFunction(_fieldsMap[fieldName])
      ? _fieldsMap[fieldName](records, db, parent)
      : records;

    return [typeInfo, records];
  };

export const resolveField = (fields, typeInfo, getRecords, parent) =>
  (record) => {
    let recordCopy = {};

    fields.forEach(({ field, mappedField, selection }) => {
      if (record[mappedField]) {
        return recordCopy[field] = record[mappedField];
      }

      if (selection && selection.selectionSet) {
        let mappedFieldName = field !== mappedField ? mappedField : null;
        let { meta, type } = typeInfo;
        let recordInfo = getRecordInfo(record, type, parent, meta);
        let typeForField = getTypeForField(field, type);

        recordCopy[field] = getRecords(selection, typeForField, getRecords,
          recordInfo, mappedFieldName);
      }
    });

    return recordCopy;
  };

export const resolveFields = (options) =>
  ([fieldNode, typeInfo, records, getRecords, parent]) => {
    let selections = get(fieldNode, 'selectionSet.selections');
    let { type } = typeInfo;
    let flatSelections = flattenSelections(selections, type, options);

    records = records.map(resolveField(flatSelections, typeInfo, getRecords,
      parent));

    return [fieldNode, typeInfo, records, parent];
  };

export function flattenSelections(selections, type, options) {
  let { fieldsMap = {} } = options;
  let _fieldsMap = fieldsMap[type.name];
  let _selections = { data: [] };

  selections.forEach(flattenSelection(_selections, type, _fieldsMap, options));

  return _selections.data;
}
