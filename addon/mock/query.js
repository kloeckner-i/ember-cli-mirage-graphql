import { GraphQLList } from 'graphql';
import { determineType } from '../type';
import { filterRecords } from '../filter-records';
import { getRecordsByType } from '../db';
import { pipe } from '../utils';
import { maybeMapFieldByFunction, resolveFields } from '../fields';

const determineReturnValue = ([{ returnType }, records]) =>
  returnType instanceof GraphQLList ? records : records[0];

const mockQueryFn = (db, options) =>
  (_, vars, __, { fieldNodes, returnType, schema }) => {
    const getRecords = pipe(
      determineType(schema._typeMap),
      getRecordsByType(db),
      filterRecords(db, vars, options),
      resolveFields(options),
      maybeMapFieldByFunction(db, options),
      determineReturnValue
    );

    return getRecords(fieldNodes[0], returnType, getRecords);
  };

export default mockQueryFn;
