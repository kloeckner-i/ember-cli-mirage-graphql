const SELECTABLE_KINDS = ['Field', 'InlineFragment'];

const normalizeSelection = (fieldName, fieldsMap, selection) => ({
  field: fieldName,
  mappedField: (fieldsMap[fieldName] || fieldName),
  selection
});

const getIsSelectable = (kind, fieldName) =>
  SELECTABLE_KINDS.includes(kind) && fieldName !== '__typename';

const getSelectionReducer = (type, fieldsMap = {}, options) =>
  (selections, selection) => {
    let { kind, name = {}, selectionSet } = selection;
    let { value: fieldName } = name;

    if (getIsSelectable(kind, fieldName)) {
      selections = selections.concat(
        kind === 'Field'
          ? normalizeSelection(fieldName, fieldsMap, selection)
          : normalizeSelections(selectionSet.selections, type, options)
      );
    }

    return selections;
  };

export function normalizeSelections(selections, type, options) {
  let { fieldsMap = {} } = options;
  let _fieldsMap = fieldsMap[type.name];

  return selections.reduce(getSelectionReducer(type, _fieldsMap, options), []);
}
