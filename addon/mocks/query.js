import { GraphQLList } from 'graphql';
import { determineType } from '../type';
import { filterRecords } from '../filter/filter-records';
import { getRecordsByType } from '../db';
import { maybeMapFieldByFunction } from '../fields/map';
import { pipe } from '../utils';
import { resolveFieldsForRecords } from '../fields/resolve';

const determineReturnValue = ([{ returnType }, records]) =>
  returnType instanceof GraphQLList ? records : records[0];

const mockQueryFn = (db, options) =>
  (_, vars, __, { fieldNodes, returnType, schema }) => {
    const getAllRecordsByType = pipe(
      determineType(schema._typeMap),
      getRecordsByType(db)
    );
    const getRecords = pipe(
      getAllRecordsByType,
      filterRecords(db, vars, options),
      resolveFieldsForRecords(getAllRecordsByType, options),
      maybeMapFieldByFunction(db, options),
      determineReturnValue
    );
    let records = getRecords(fieldNodes[0], returnType, getRecords);

    return records;
  };

export default mockQueryFn;
