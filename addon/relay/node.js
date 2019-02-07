import { getIsEdge } from './edges';

// TODO: Add unit test for this
const composeGetNodeField = (getIsEdge) =>
  (fieldName, field) =>
    getIsEdge(fieldName, field) && field.fields.node;

export const getNodeField = composeGetNodeField(getIsEdge);

export const getIsRelayNodeField = (fieldName, { isRelayEdges }) =>
  fieldName === 'node' && isRelayEdges;
