import { createFieldInfo } from './info/create';
import { getFieldName } from './name';

const getSelectedFieldsReducer = (type, getType) =>
  (selections, selection) => {
    let fieldName = getFieldName(selection);
    let fieldType = fieldName !== '__typename' && type._fields[fieldName].type;

    selections[fieldName] = selection.selectionSet
      ? createFieldInfo(selection, fieldType, getType)
      : null;

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
