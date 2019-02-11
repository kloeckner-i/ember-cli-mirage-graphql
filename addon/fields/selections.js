import createFieldInfo from './info/create';
import getFieldName from './name';
import { partial } from '../utils';

export const getIsSelectionInlineFragment = ({ kind }) =>
  kind === 'InlineFragment';

export const composeInlineFragmentReducer = (getIsSelectionInlineFragment) =>
  (selections, selection) =>
    selections.concat(
      getIsSelectionInlineFragment(selection)
        ? selection.selectionSet.selections
        : selection
    );

const inlineFragmentFieldsReducer =
  composeInlineFragmentReducer(getIsSelectionInlineFragment);

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
