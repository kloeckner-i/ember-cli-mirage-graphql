import mockMutationFn from './mutation';
import mockQueryFn from './query';
import { contextSet } from '../utils';

export function createMocksForSchema(schema, db, options) {
  let { _mutationType, _queryType } = schema;

  return {
    RootMutationType: () =>
      mockRootType(_mutationType._fields, mockMutationFn, db, options),
    RootQueryType: () =>
      mockRootType(_queryType._fields, mockQueryFn, db, options)
  };
}

const mockRootType = (rootTypes = {}, mockFn, db, options) =>
  Object.keys(rootTypes).reduce((mocks, rootType) =>
    contextSet(mocks, rootType, mockFn(db, options)), {});
