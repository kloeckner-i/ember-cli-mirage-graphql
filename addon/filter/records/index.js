import applyFilters from '../apply';
import createFilters from '../create';
import { applyRelayFilters } from '../../relay/filters';
import { filterByParent } from '../parent';
import { get } from '@ember/object';
import { getAreRecordsEmpty } from '../../records';
import { getIsRelayRecord } from '../../relay/record';
import { pipeWithMeta } from '../../utils';
import { resolveFieldName } from '../../fields/name';

const filterPipeline = pipeWithMeta(
  filterByParent,
  applyFilters,
  applyRelayFilters
);

// TODO: Add unit test for this
export const composeFilterRecords =
  (getAreRecordsEmpty, getIsRelayRecord, createFilters, resolveFieldName) =>
    (records, { field, fieldName, options, vars }) => {
      if (getAreRecordsEmpty(records) || getIsRelayRecord(field)) {
        return records;
      }

      let filters = createFilters(field, vars, options);
      let parentTypeName = get(field, 'parent.field.type.name');

      fieldName = resolveFieldName(fieldName, parentTypeName, options);
      records = filterPipeline(records, { field, fieldName, filters });

      return records;
    };

const filterRecords = composeFilterRecords(getAreRecordsEmpty, getIsRelayRecord,
  createFilters, resolveFieldName);

export default filterRecords;
