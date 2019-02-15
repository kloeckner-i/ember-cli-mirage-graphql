import createFieldInfo from '../info/create';
import getFieldName from '../name';
import { fragmentFieldsReducer, inlineFragmentFieldsReducer } from './fragments';
import { partial } from '../../utils';

export const selectedFieldsReducer =
  (getFieldName, createFieldInfo, getType, type, fragments, selections, selection) => {
    let fieldName = getFieldName(selection);
    let fieldType = fieldName !== '__typename' && type._fields[fieldName].type;

    selections[fieldName] = selection.selectionSet
      ? createFieldInfo(selection, fieldName, fieldType, fragments, getType)
      : null;

    return selections;
  };

const composeGetSelectedFields =
  (fragmentsReducer, inlineFragmentsReducer, selectedFieldsReducer) =>
    ({ selectionSet = {} }, type, fragments, getType) => {
      let fieldsReducer = partial(selectedFieldsReducer, getFieldName,
        createFieldInfo, getType, type, fragments);
      let fragmentReducer = partial(fragmentsReducer, fragments);
      let { selections = [] } = selectionSet;
      let selectedFields = selections
        .reduce(fragmentReducer, [])
        .reduce(inlineFragmentsReducer, [])
        .reduce(fieldsReducer, {});

      return selectedFields;
    };

export const getSelectedFields = composeGetSelectedFields(fragmentFieldsReducer,
  inlineFragmentFieldsReducer, selectedFieldsReducer);
