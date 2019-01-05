const RELAY_VAR_NAMES = ['after', 'before', 'first', 'last'];

export function applyRelayFilters(records, { after, before, first, last }) {
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

export function reduceRelayFilters(filters,  { key, value = {} }) {
  let { value: val } = value;

  if (val) {
    filters[key] = parseInt(val);
  }

  return filters;
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
