import mockMutationFn from './mutation';
import mockQueryFn from './query';
import { contextSet, reduceKeys } from '../utils';

const getMocksReducer = (db, options) =>
  (mocks, [{ _fields, name }, mockFn]) =>
    contextSet(mocks, name, () => mockRootType(_fields, mockFn, db, options));

const mockRootType = (fields = {}, mockFn, db, options) =>
  reduceKeys(fields, (mocks, field) =>
    contextSet(mocks, field, mockFn(db, options)), {});

export const createMocksForSchema =
  ({ _mutationType, _queryType }, db, options) =>
    [[_queryType, mockQueryFn], [_mutationType, mockMutationFn]]
      .reduce(getMocksReducer(db, options), {});
