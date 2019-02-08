export const getMappedFieldNameByParentType =
  (fieldName, parent, fieldsMap = {}) =>
    parent && parent.field.type.name in fieldsMap &&
      fieldsMap[parent.field.type.name][fieldName];
