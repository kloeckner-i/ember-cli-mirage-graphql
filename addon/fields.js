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

const getTypeForField = (field, { _fields }) => _fields[field].type;

export const mapFields = (fields, type, getRecords) => (record) => {
  let parent = { record, type: camelize(type.name) };
  let recordCopy = {};

  fields.forEach(({ field, mappedField, selection }) => {
    let mappedFieldName = field !== mappedField ? mappedField : null;
    let value = record[mappedField];

    if (value || (selection && selection.selectionSet)) {
      recordCopy[field] = value
        ? value
        : getRecords(selection, getTypeForField(field, type),
            getRecords, parent, mappedFieldName);
    }
  });

  return recordCopy;
};

export const maybeMapFieldByFunction = ({ fieldsMap = {} } = {}) =>
  ([fieldNode, typeInfo, records]) => {
    let fieldName = getFieldName(fieldNode);

    records = fieldName in fieldsMap && isFunction(fieldsMap[fieldName])
      ? fieldsMap[fieldName](records)
      : records;

    return [typeInfo, records];
  };

export const resolveFields = (options) =>
  ([fieldNode, typeInfo, records, getRecords]) => {
    let selections = get(fieldNode, 'selectionSet.selections');
    let { type } = typeInfo;
    let flatSelections = flattenSelections(selections, type, options);

    records = records.map(mapFields(flatSelections, type, getRecords));

    return [fieldNode, typeInfo, records];
  };

export function flattenSelections(selections, type, options) {
  let { fieldsMap = {} } = options;
  let _fieldsMap = fieldsMap[type.name];
  let _selections = { data: [] };

  selections.forEach(flattenSelection(_selections, type, _fieldsMap, options));

  return _selections.data;
}
