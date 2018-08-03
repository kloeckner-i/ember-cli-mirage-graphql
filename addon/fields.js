import { camelize } from 'ember-cli-mirage/utils/inflector';

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

export function flattenSelections(selections, type, options) {
  let { fieldsMap = {} } = options;
  let _fieldsMap = fieldsMap[type.name];
  let _selections = { data: [] };

  selections.forEach(flattenSelection(_selections, type, _fieldsMap, options));

  return _selections.data;
}
