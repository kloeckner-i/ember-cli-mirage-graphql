import MockQueryInfo from './query-info';
import {
  filterRecordsByVars,
  maybeFilterRecordsByMappedField
} from '../filter-records';
import { getRecordsByType, getTableName } from '../db';
import { getRelatedRecords } from '../related-records';
import { pipe } from '../utils';
import { maybeWrapForRelay, maybeUnwrapRelayType } from '../relay-pagination';

const mockQueryFn = (db, options) =>
  (_, vars, __, { fieldName, returnType }) => {
    const mockFn = pipe(
      maybeUnwrapRelayType,
      getTableName,
      getRecordsByType(db),
      filterRecordsByVars(vars, options),
      getRelatedRecords(db, options),
      maybeFilterRecordsByMappedField(fieldName, options),
      maybeWrapForRelay
    );

    let mockQueryInfo = MockQueryInfo.create({ type: returnType });

    let result = mockFn(mockQueryInfo);

    return result;
  };

export default mockQueryFn;
