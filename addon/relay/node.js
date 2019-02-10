import { getIsEdge } from './edges';

export const composeGetNodeField = (getIsEdge) =>
  (fieldName, field) =>
    getIsEdge(fieldName, field) && field.fields.node;

export const getNodeField = composeGetNodeField(getIsEdge);

export const getIsRelayNodeField = (fieldName, { isRelayEdges }) =>
  fieldName === 'node' && isRelayEdges;
