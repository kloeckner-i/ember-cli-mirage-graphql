import createFilters from './create';
import { applyRelayFilters } from '../relay/filters';
import { filterByParent } from './parent';
import { get } from '@ember/object';
import { resolveFieldName } from '../fields/name';

const filterBy = (records, key, value) =>
  records.filter((record) => get(record, key) === value);

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

export function filterRecords(records, field, fieldName, vars, options) {
  if (getAreRecordsEmpty(records)) {
    return records;
  }

  let filters = createFilters(field, vars, options);
  let resolvedFieldName = resolveFieldName(fieldName, field.parent, options);

  if (field.parent) {
    records = filterByParent(records, field, resolvedFieldName);
  }

  records = filters.reduce(reduceRecordsByFilter, records);

  if (field.relayFilters) {
    records = applyRelayFilters(records, field);
  }

  return records;
}
