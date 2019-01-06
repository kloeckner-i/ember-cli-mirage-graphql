import { get } from '@ember/object';

const RELAY_VAR_NAMES = ['after', 'before', 'first', 'last'];

const createRelayFilters = (records, parent) =>
  getRelayFilters(parent).reduce(reduceRelayFilters, {});

const getRelayFilters = (parent) =>
  get(parent, 'parent.meta.relayConnection.filters') || [];

function reduceRelayFilters(filters,  { key, value = {} }) {
  let { value: val } = value;

  if (val) {
    filters[key] = parseInt(val);
  }

  return filters;
}

export function applyRelayFilters(records, parent) {
  let { after, before, first, last } = createRelayFilters(records, parent);

  if (after != null) {
    records = records.slice(after);
  }

  if (before != null) {
    records = records.slice(0, before + 1);
  }

  if (first != null) {
    records = records.slice(0, first);
  }

  if (last != null) {
    records = records.slice(-last);
  }

  return records;
}

export function spliceRelayFilters(filters) {
  let relayFilters = [];

  filters = filters.reduce((filters, filter) => {
    RELAY_VAR_NAMES.includes(filter.mappedKey)
      ? relayFilters.push(filter)
      : filters.push(filter);

    return filters;
  }, []);

  return { filters, relayFilters };
}
