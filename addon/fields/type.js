import { GraphQLInterfaceType } from 'graphql';
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
  let typeInfo = { returnType: type, type };

  if (type instanceof GraphQLInterfaceType) {
    typeInfo.type = getTypeFromField(field, typeMap);
  }

  if (type.ofType) {
    typeInfo.type = type.ofType;
  }

  return typeInfo;
};
