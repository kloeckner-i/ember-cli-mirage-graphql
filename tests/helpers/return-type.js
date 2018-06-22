import { GraphQLList, GraphQLObjectType } from 'graphql';
import { camelize, pluralize } from 'ember-cli-mirage/utils/inflector';

export function createListReturnType(typeName, listTypeName) {
  let relatedType = new GraphQLObjectType({ name: listTypeName });
  let fieldName = pluralize(camelize(listTypeName));
  let returnType = {
    name: typeName,
    _fields: {
      [fieldName]: {
        name: fieldName,
        type: new GraphQLList(relatedType)
      }
    }
  };

  returnType._fields[fieldName].type.ofType.astNode = {};

  return returnType;
}
