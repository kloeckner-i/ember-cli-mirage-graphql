import { get } from '@ember/object';
import { spliceRelayFilters } from './filters';

const CONNECTION_FIELDS = ['edges', 'pageInfo'];
const CONNECTION_TYPE_REGEX = /.+Connection$/;

const filterForConnectionFields = ({ name }) =>
  CONNECTION_FIELDS.includes(name.value);

export const getIsRelayConnection = (type, { selectionSet }) =>
  CONNECTION_TYPE_REGEX.test(type.name)
    && selectionSet.selections.filter(filterForConnectionFields).length
      === CONNECTION_FIELDS.length;

export const getIsRelayConnectionField = (fieldName, parent) =>
  CONNECTION_FIELDS.includes(fieldName) && get(parent, 'meta.relayConnection');

// TODO: A lot could be named better here
export function handleRelayConnection(typeInfo, filters) {
  let splicedFilters = spliceRelayFilters(filters);

  typeInfo.meta = typeInfo.meta || {};
  typeInfo.meta.relayConnection = { filters: splicedFilters.relayFilters };

  return splicedFilters.filters;
}
