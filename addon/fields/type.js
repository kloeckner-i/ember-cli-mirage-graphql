import { GraphQLInterfaceType, GraphQLList } from 'graphql';
import { get } from '@ember/object';

const getInlineFragment = (selections) =>
  selections.find((selection) =>
    selection.kind === 'InlineFragment');

function getTypeFromField(field, typeMap) {
  let selections = get(field, 'selectionSet.selections');
  let { typeCondition } = getInlineFragment(selections);
  let typeName = get(typeCondition, 'name.value');

  return typeMap[typeName];
}

export const getTypeForField = (typeMap, field, type) => {
  let isList = type instanceof GraphQLList;
  let recordType = type;

  if (type instanceof GraphQLInterfaceType) {
    recordType = getTypeFromField(field, typeMap);
  }

  if (type.ofType) {
    recordType = type.ofType;
  }

  return { isList, recordType };
};
