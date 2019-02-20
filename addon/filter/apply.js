import { get } from '@ember/object';

export const filterBy = (records, key, value) =>
  records.filter((record) => get(record, key) === value);

export const composeReduceRecordsByFilter = (filterBy) =>
  (records, filter) => {
    let { fn, hasFnValue, name, resolvedName, value } = filter;

    if (hasFnValue || value != null) {
      return hasFnValue
        ? fn(records, name, value)
        : filterBy(records, resolvedName, value);
    }

    return records;
  };

const reduceRecordsByFilter = composeReduceRecordsByFilter(filterBy);

const composeApplyFilters = (recordsReducer) =>
  (records, { filters }) =>
    filters.reduce(recordsReducer, records);

const applyFilters = composeApplyFilters(reduceRecordsByFilter);

export default applyFilters;
