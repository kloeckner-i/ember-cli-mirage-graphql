import applyFilters from '../apply';
import createFilters from '../create';
import filterByParent from '../parent';
import resolveFieldName from '../../fields/name/resolve';
import { applyRelayFilters } from '../../relay/filters';
import { get } from '@ember/object';
import { getAreRecordsEmpty } from '../../records';
import { getIsRelayRecord } from '../../relay/record';
import { pipeWithMeta } from '../../utils';

const filterPipeline = pipeWithMeta(
  filterByParent,
  applyFilters,
  applyRelayFilters
);

export const composeFilterRecords =
  (getAreRecordsEmpty, getIsRelayRecord, createFilters, resolveFieldName, pipeline) =>
    (records, { field, fieldName, options, vars }) => {
      if (getAreRecordsEmpty(records) || getIsRelayRecord(field)) {
        return records;
      }

      let filters = createFilters(field, vars, options);
      let parentTypeName = get(field, 'parent.field.type.name');

      fieldName = resolveFieldName(fieldName, parentTypeName, options);
      records = pipeline(records, { field, fieldName, filters });

      return records;
    };

const filterRecords = composeFilterRecords(getAreRecordsEmpty, getIsRelayRecord,
  createFilters, resolveFieldName, filterPipeline);

export default filterRecords;
