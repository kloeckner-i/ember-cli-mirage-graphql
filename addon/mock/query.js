import MockInfo from './info';
import {
  filterRecordsByVars,
  maybeFilterRecordsByMappedField
} from '../filter-records';
import { getRecordsByType } from '../db';
import { getRelatedRecords } from '../related-records';
import { maybeUnwrapRelayType, maybeWrapForRelay } from '../relay-pagination';
import { pipe } from '../utils';

const mockQueryFn = (db, options) =>
  (_, vars, __, { fieldName, returnType }) => {
    const mockFn = pipe(
      maybeUnwrapRelayType,
      getRecordsByType(db),
      filterRecordsByVars(vars, options),
      getRelatedRecords(db, options),
      maybeFilterRecordsByMappedField(fieldName, options),
      maybeWrapForRelay
    );

    let mockInfo = MockInfo.create({ returnType });

    let result = mockFn(mockInfo);

    return result;
  };

export default mockQueryFn;
