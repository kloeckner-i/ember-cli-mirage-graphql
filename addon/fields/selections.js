import createFieldInfo from './info/create';
import getFieldName from './name';
import { partial } from '../utils';

export const inlineFragmentFieldsReducer = (selections, selection) =>
  selections.concat(
    selection.kind === 'InlineFragment'
      ? selection.selectionSet.selections
      : selection
  );

export const selectedFieldsReducer =
  (getFieldName, createFieldInfo, getType, type, selections, selection) => {
    let fieldName = getFieldName(selection);
    let fieldType = fieldName !== '__typename' && type._fields[fieldName].type;

    selections[fieldName] = selection.selectionSet
      ? createFieldInfo(selection, fieldName, fieldType, getType)
      : null;

    return selections;
  };

const composeGetSelectedFields =
  (inlineFragmentFieldsReducer, selectedFieldsReducer) =>
    ({ selectionSet = {} }, type, getType) => {
      let fieldsReducer = partial(selectedFieldsReducer, getFieldName,
        createFieldInfo, getType, type);
      let { selections = [] } = selectionSet;
      let selectedFields = selections
        .reduce(inlineFragmentFieldsReducer, [])
        .reduce(fieldsReducer, {});

      return selectedFields;
    };

export const getSelectedFields =
  composeGetSelectedFields(inlineFragmentFieldsReducer, selectedFieldsReducer);
