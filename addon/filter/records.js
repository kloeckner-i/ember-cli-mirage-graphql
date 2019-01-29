import applyFilters from './apply';
import { applyRelayFilters } from '../relay/filters';
import { filterByParent } from './parent';
import { pipeWithMeta } from '../utils';

const filterPipeline = pipeWithMeta(
  filterByParent,
  applyFilters,
  applyRelayFilters
);

const getAreRecordsEmpty = ([firstRecord]) =>
  firstRecord == null || !Object.keys(firstRecord).length;

export default function filterRecords(records, filters, field, fieldName) {
  if (getAreRecordsEmpty(records)) {
    return records;
  }

  records = filterPipeline(records, { field, fieldName, filters });

  return records;
}
