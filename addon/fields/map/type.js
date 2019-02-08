export const getFieldsMapForType = (parent, fieldsMap) =>
  parent ? fieldsMap[parent.field.type.name] : fieldsMap;
