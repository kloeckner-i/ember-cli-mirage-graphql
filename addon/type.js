import { GraphQLInterfaceType } from 'graphql';
import { get } from '@ember/object';

const getInlineFragment = (selections) => selections.find((selection) =>
  selection.kind === 'InlineFragment');

function getTypeFromFieldNode(fieldNode, typeMap) {
  let selections = get(fieldNode, 'selectionSet.selections');
  let { typeCondition } = getInlineFragment(selections);
  let typeName = get(typeCondition, 'name.value');

  return typeMap[typeName];
}

function getTypeFromField(field, typeMap) {
  let selections = get(field, 'selectionSet.selections');
  let { typeCondition } = getInlineFragment(selections);
  let typeName = get(typeCondition, 'name.value');

  return typeMap[typeName];
}

export const determineType = (typeMap) =>
  (fieldNode, type, getRecords, parent, mappedFieldName) => {
    let typeInfo = { returnType: type, type };

    if (type instanceof GraphQLInterfaceType) {
      typeInfo.type = getTypeFromFieldNode(fieldNode, typeMap);
    }

    if (type.ofType) {
      typeInfo.type = type.ofType;
    }

    return [fieldNode, typeInfo, getRecords, parent, mappedFieldName];
  };

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
