export const getFieldName = ({ alias, name }) =>
  alias && alias.value || name.value;

export function resolveFieldName(fieldName, typeName, { fieldsMap = {} } = {}) {
  let fieldsMapForType = fieldsMap[typeName];
  let resolvedFieldName = fieldsMapForType && fieldsMapForType[fieldName];

  return resolvedFieldName || fieldName;
}
