import createFieldInfo from '../info/create';
import { getFieldNameAndAlias } from '../name';
import { fragmentFieldsReducer, inlineFragmentFieldsReducer } from './fragments';
import { partial } from '../../utils';

const getFieldType = (type, fieldName) =>
  fieldName !== '__typename' && type._fields[fieldName].type;

export const selectedFieldsReducer =
  (getFieldNameAndAlias, getFieldType, createFieldInfo, getType, type, fragments, selections, selection) => {
    let { fieldAlias, fieldName } = getFieldNameAndAlias(selection);
    let fieldInfoName = fieldAlias || fieldName;
    let fieldType = getFieldType(type, fieldName);

    selections[fieldName] = selection.selectionSet
      ? createFieldInfo(selection, fieldInfoName, fieldType, fragments, getType)
      : null;

    return selections;
  };

const composeGetSelectedFields =
  (fragmentsReducer, inlineFragmentsReducer, selectedFieldsReducer) =>
    ({ selectionSet = {} }, type, fragments, getType) => {
      let fieldsReducer = partial(selectedFieldsReducer, getFieldNameAndAlias,
        getFieldType, createFieldInfo, getType, type, fragments);
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
