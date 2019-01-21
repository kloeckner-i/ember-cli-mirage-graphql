import { contextPush, contextSet } from '../utils';
import { createPageInfo } from './page-info';

const RELAY_VAR_NAMES = ['after', 'before', 'first', 'last'];

const getFilterTypeToSet = (name) =>
  RELAY_VAR_NAMES.includes(name) ? 'relayFilters' : 'filters';

const reduceRelayFiltersToHash = (filters,  { name, value }) =>
  value ? contextSet(filters, name, parseInt(value)) : filters;

const relayFilterReducer = (filterTypes, filter) =>
  contextPush(filterTypes, getFilterTypeToSet(filter.resolvedName), filter);

const setPageInfo = (field, records, firstRecordId, lastRecordId) =>
  field.parent.field.fields.pageInfo.relayPageInfo = createPageInfo(records,
    firstRecordId, lastRecordId, field.type.name);

export function applyRelayFilters(records, field) {
  let hasRecords = !!records.length;
  let firstRecordId = hasRecords && records[0].id;
  let lastRecordId = hasRecords && records[records.length - 1].id;

  if (hasRecords) {
    let { after, before, first, last } = field.relayFilters
      .reduce(reduceRelayFiltersToHash, {});

    if (after != null) records = records.slice(after);
    if (before != null) records = records.slice(0, before + 1);
    if (first != null) records = records.slice(0, first);
    if (last != null) records = records.slice(-last);
  }

  setPageInfo(field, records, firstRecordId, lastRecordId);

  return records;
}

export const spliceRelayFilters = (filters) =>
  filters.reduce(relayFilterReducer, { filters: [], relayFilters: [] });
