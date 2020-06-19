import { isInterfaceType, isUnionType, isObjectType } from 'graphql';
import {
  Model,
  belongsTo,
  hasMany,
  _utilsInflectorCamelize as camelize
} from 'miragejs';
import {
  isNotBuiltInGraphQLSchemaObjectType,
  unwrapTypeForModel
} from './graphql-utils';
import { isRelayType } from './relay-pagination';
import { unwrapType } from '../graphql-auto-resolve/type-utils';

const ASSOCIATION_GRAPHQL_TYPE_CHECKS = [
  isInterfaceType,
  isObjectType,
  isUnionType
];

function isAssociationType(type) {
  return ASSOCIATION_GRAPHQL_TYPE_CHECKS.find((checkType) => checkType(type));
}

function createAssociationOptionsForFields(fields) {
  return function(associationOptions, fieldName) {
    const fieldType = fields[fieldName].type
    const { isList, type: unwrappedType } = unwrapTypeForModel(fieldType);

    if (isAssociationType(unwrappedType)) {
      const associationName = camelize(unwrappedType.name);
      const options = { polymorphic: isUnionType(unwrappedType) };

      associationOptions[fieldName] = isList
        ? hasMany(associationName, options)
        : belongsTo(associationName, options);
    }
    
    return associationOptions;
  };
}

function createAssociationOptions(type) {
  const fields = type.getFields();
  const associationOptions =
    Object
      .keys(fields)
      .reduce(createAssociationOptionsForFields(fields), {});

  return associationOptions;
}

function ensureModel({ graphQLSchema, mirageSchema, type }) {
  if (shouldAddModel(mirageSchema, graphQLSchema, type)) {
    const associationOptions = createAssociationOptions(type);
    const model = Model.extend(associationOptions);

    mirageSchema.registerModel(type.name, model);
  }
}

function shouldAddModel(mirageSchema, graphQLSchema, type) {
  return (
    !mirageSchema.hasModelForModelName(type.name) &&
    isObjectType(type) &&
    isNotBuiltInGraphQLSchemaObjectType(graphQLSchema, type) &&
    !isRelayType(type) &&
    !type.name.startsWith('__')
  );
}

// Test: it can clone a record from Mirage's database
export function cloneRecord({ record, resolverInfo }) {
  const [{ selectionSet: { selections } }] = resolverInfo.fieldNodes;
  const keys = selections.map(({ alias, name }) => alias || name.value);

  return keys.reduce(function(clonedRecord, key) {
    clonedRecord[key] = record[key];

    return clonedRecord;
  }, {});
}

// Test: it adds appopriate models to the schema with associations
export function ensureModels({ graphQLSchema, mirageSchema }) {
  const typeMap = graphQLSchema.getTypeMap();

  Object.keys(typeMap).forEach(function(typeName) {
    const { type } = unwrapType(typeMap[typeName]);

    ensureModel({ graphQLSchema, mirageSchema, type });
  });
}
