import { applyRelayFilters } from '../relay/filters';
import { filterByParent } from './parent';
import { get } from '@ember/object';
import { pipeWithMeta } from '../utils';

const applyFilters = (records, { filters }) =>
  filters.reduce(reduceRecordsByFilter, records)

const filterBy = (records, key, value) =>
  records.filter((record) => get(record, key) === value);

const filterPipeline = pipeWithMeta(
  filterByParent,
  applyFilters,
  applyRelayFilters
);

const getAreRecordsEmpty = ([firstRecord]) =>
  firstRecord == null || !Object.keys(firstRecord).length;

function reduceRecordsByFilter(records, filter) {
  let { fn, hasFnValue, name, resolvedName, value } = filter;

  if (hasFnValue || value != null) {
    return hasFnValue
      ? fn(records, name, value)
      : filterBy(records, resolvedName, value);
  }

  return records;
}

export default function filterRecords(records, filters, field, fieldName) {
  if (getAreRecordsEmpty(records)) {
    return records;
  }

  records = filterPipeline(records, { field, fieldName, filters });

  return records;
}
