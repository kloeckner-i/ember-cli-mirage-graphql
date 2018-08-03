import { determineType } from '../type';
import { getRecordsByType } from '../db';
import { filterRecords } from '../filter-records';
import { pipe } from '../utils';

const mockQueryFn = (db, options) =>
  (_, vars, __, { fieldNodes, returnType, schema }) => {
    const getRecords = pipe(
      determineType(schema._typeMap),
      getRecordsByType(db),
      filterRecords(db, vars, options)
    );

    return getRecords(fieldNodes[0], returnType, getRecords);
  };

export default mockQueryFn;
