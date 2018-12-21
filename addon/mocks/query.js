import { GraphQLList } from 'graphql';
import { determineType } from '../type';
import { filterRecords } from '../filter-records';
import { getRecordsByType } from '../db';
import { maybeMapFieldByFunction } from '../fields/map';
import { pipe } from '../utils';
import { resolveFieldsForRecords } from '../fields/resolve';

const determineReturnValue = ([{ returnType }, records]) =>
  returnType instanceof GraphQLList ? records : records[0];

const mockQueryFn = (db, options) =>
  (_, vars, __, { fieldNodes, returnType, schema }) => {
    const getRecords = pipe(
      determineType(schema._typeMap),
      getRecordsByType(db),
      filterRecords(db, vars, options),
      resolveFieldsForRecords(options),
      maybeMapFieldByFunction(db, options),
      determineReturnValue
    );
    let records = getRecords(fieldNodes[0], returnType, getRecords);

    return records;
  };

export default mockQueryFn;
