import { createFieldInfo } from './info';
import { getFieldName } from './name';

const getSelectedFieldsReducer = (type, getType) =>
  (selections, selection) => {
    let fieldName = getFieldName(selection);

    if (fieldName !== '__typename') {
      selections[fieldName] = selection.selectionSet
        ? createFieldInfo(selection, type._fields[fieldName].type, getType)
        : null;
    }

    return selections;
  }

const inlineFragmentFieldsReducer = (selections, selection) =>
  selections.concat(
    selection.kind === 'InlineFragment'
      ? selection.selectionSet.selections
      : selection
  );

export function getSelectedFields({ selectionSet = {} }, type, getType) {
  let selectedFieldsReducer = getSelectedFieldsReducer(type, getType);
  let { selections = [] } = selectionSet;
  let selectedFields = selections
    .reduce(inlineFragmentFieldsReducer, [])
    .reduce(selectedFieldsReducer, {});

  return selectedFields;
}
