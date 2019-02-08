export default function resolveFieldName(fieldName, typeName, { fieldsMap = {} } = {}) {
  let fieldsMapForType = fieldsMap[typeName];
  let resolvedFieldName = fieldsMapForType && fieldsMapForType[fieldName];

  return resolvedFieldName || fieldName;
}
