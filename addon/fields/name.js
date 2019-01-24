export const getFieldName = ({ alias, name }) =>
  alias && alias.value || name.value;

export function resolveFieldName(fieldName, parent, { fieldsMap = {} } = {}) {
  let parentTypeName = parent && parent.field.type.name;
  let fieldsMapForType = fieldsMap[parentTypeName] || {};
  let mappedFieldName = fieldsMapForType[fieldName];

  return mappedFieldName || fieldName;
}
