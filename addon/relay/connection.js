const CONNECTION_FIELDS = ['edges', 'pageInfo'];
const CONNECTION_TYPE_REGEX = /.+Connection$/;

const filterForConnectionFields = (fieldName) =>
  CONNECTION_FIELDS.includes(fieldName);

export const getFieldHasConnectionType = (typeName) =>
  CONNECTION_TYPE_REGEX.test(typeName);

export const getIsRelayConnection = (typeName, fields) =>
  CONNECTION_TYPE_REGEX.test(typeName)
    && fields.filter(filterForConnectionFields).length === CONNECTION_FIELDS.length;
