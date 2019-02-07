export const getFieldName = ({ alias, name }) =>
  alias && alias.value || name.value;

// TODO: Add unit test for this
export const getMappedFieldName =
  (fieldName, parent, typeName, fieldsMap = {}) =>
    parent && parent.field.type.name in fieldsMap &&
      fieldsMap[parent.field.type.name][fieldName];

export function resolveFieldName(fieldName, typeName, { fieldsMap = {} } = {}) {
  let fieldsMapForType = fieldsMap[typeName];
  let resolvedFieldName = fieldsMapForType && fieldsMapForType[fieldName];

  return resolvedFieldName || fieldName;
}
