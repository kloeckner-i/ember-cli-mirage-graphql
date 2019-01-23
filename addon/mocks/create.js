import getMutationMockFn from './mutation';
import getQueryMockFn from './query';
import { contextSet, reduceKeys } from '../utils';

const getMocksReducer = (db, options) =>
  (mocks, [{ _fields, name }, mockFn]) =>
    contextSet(mocks, name, () =>
      mockRootType(_fields, mockFn, db, options));

const mockRootType = (fields = {}, mockFn, db, options) =>
  reduceKeys(fields, (mocks, field) =>
    contextSet(mocks, field, mockFn(db, options)), {});

export function createMocksForSchema(schema, db, options) {
  let typesAndMockFns = [
    [schema._queryType, getQueryMockFn],
    [schema._mutationType, getMutationMockFn]
  ];
  let mocksReducer = getMocksReducer(db, options);
  let mocks = typesAndMockFns.reduce(mocksReducer, {});

  return mocks;
}
