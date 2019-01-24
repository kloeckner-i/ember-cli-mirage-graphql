const CONNECTION_FIELDS = ['edges', 'pageInfo'];
const CONNECTION_TYPE_REGEX = /.+Connection$/;

export const fieldHasConnectionType = (typeName) =>
  CONNECTION_TYPE_REGEX.test(typeName);

const filterForConnectionFields = (fieldName) =>
  CONNECTION_FIELDS.includes(fieldName);

export const getIsRelayConnection = (typeName, fields) =>
  CONNECTION_TYPE_REGEX.test(typeName)
    && fields.filter(filterForConnectionFields).length === CONNECTION_FIELDS.length;
