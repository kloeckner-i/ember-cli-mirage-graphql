import createPageInfo from './page-info';
import { contextPush, contextSet } from '../utils';
import { get } from '@ember/object';

const RELAY_VAR_NAMES = ['after', 'before', 'first', 'last'];

export const composeSetRelayPageInfo = (createPageInfo) =>
  (pageInfoField, typeName, records, firstRecordId, lastRecordId) =>
    pageInfoField.relayPageInfo =
      createPageInfo(records, firstRecordId, lastRecordId, typeName);

const setRelayPageInfo = composeSetRelayPageInfo(createPageInfo);

export const getRelayFiltersFromField = ({ relayFilters }) =>
  relayFilters.reduce((filters, { name, value }) =>
    value ? contextSet(filters, name, parseInt(value)) : filters, {});

export const composeApplyRelayFilters =
  (getRelayFiltersFromField, setRelayPageInfo) =>
    (records, { field }) => {
      let hasRecords = !!records.length;
      let firstRecordId = hasRecords && records[0].id;
      let lastRecordId = hasRecords && records[records.length - 1].id;
      let pageInfoField = get(field, 'parent.field.fields.pageInfo');
      let typeName = get(field, 'type.name');

      if (hasRecords && field.relayFilters) {
        let { after, before, first, last } = getRelayFiltersFromField(field);

        if (after != null) records = records.slice(after);
        if (before != null) records = records.slice(0, before - 1);
        if (first != null) records = records.slice(0, first);
        if (last != null) records = records.slice(-last);
      }

      if (pageInfoField) {
        setRelayPageInfo(pageInfoField, typeName, records, firstRecordId,
          lastRecordId);
      }

      return records;
    };

export const applyRelayFilters =
  composeApplyRelayFilters(getRelayFiltersFromField, setRelayPageInfo);

export const getFilterTypeToSet = (name) =>
  RELAY_VAR_NAMES.includes(name) ? 'relayFilters' : 'filters';

export const composeSpliceRelayFilters = (getFilterTypeToSet) =>
  (filters) => filters.reduce(
    (filterTypes, filter) =>
      contextPush(filterTypes, getFilterTypeToSet(filter.resolvedName), filter),
    { filters: [], relayFilters: [] }
  );

export const spliceRelayFilters = composeSpliceRelayFilters(getFilterTypeToSet);
