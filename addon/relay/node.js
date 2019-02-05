export const getIsRelayNodeField = (fieldName, { isRelayEdges }) =>
  fieldName === 'node' && isRelayEdges;
