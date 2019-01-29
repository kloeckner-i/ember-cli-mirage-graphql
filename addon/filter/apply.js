import { get } from '@ember/object';

const applyFilters = (records, { filters }) =>
  filters.reduce(reduceRecordsByFilter, records)

const filterBy = (records, key, value) =>
  records.filter((record) => get(record, key) === value);

function reduceRecordsByFilter(records, filter) {
  let { fn, hasFnValue, name, resolvedName, value } = filter;

  if (hasFnValue || value != null) {
    return hasFnValue
      ? fn(records, name, value)
      : filterBy(records, resolvedName, value);
  }

  return records;
}

export default applyFilters;
