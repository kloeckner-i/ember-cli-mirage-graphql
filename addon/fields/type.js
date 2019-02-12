import { GraphQLInterfaceType, GraphQLList } from 'graphql';
import { get } from '@ember/object';
import { getIsSelectionInlineFragment } from './selections';

const findInlineFragment = (selections) =>
  selections.find(getIsSelectionInlineFragment);

export const getIsInterface = (type) => type instanceof GraphQLInterfaceType;

const getIsList = (type) => type instanceof GraphQLList;

export const composeGetTypeForInterface = (findInlineFragment) =>
  (field, typeMap) => {
    let selections = get(field, 'selectionSet.selections');
    let { typeCondition } = findInlineFragment(selections);
    let typeName = get(typeCondition, 'name.value');

    return typeMap[typeName];
  };

const getTypeForInterface = composeGetTypeForInterface(findInlineFragment);

export const composeGetTypeForField =
  (getIsList, getIsInlineFragment, getTypeForInterface) =>
    (typeMap, field, type) => {
      let isList = getIsList(type);
      let recordType = type;

      if (getIsInterface(type)) {
        recordType = getTypeForInterface(field, typeMap);
      }

      if (type.ofType) {
        recordType = type.ofType;
      }

      return { isList, recordType };
    };

export const getTypeForField =
  composeGetTypeForField(getIsList, getIsInterface, getTypeForInterface);
