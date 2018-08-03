import mockMutationFn from './mutation';
import mockQueryFn from './query';
import { contextSet, reduceKeys } from '../utils';

const addRootMock = (mocks, rootType, mockFn, db, options) =>
  contextSet(mocks, rootType.name, () =>
    mockRootType(rootType._fields, mockFn, db, options));

const mockRootType = (fields = {}, mockFn, db, options) =>
  reduceKeys(fields, (mocks, field) =>
    contextSet(mocks, field, mockFn(db, options)), {});

export function createMocksForSchema(schema, db, options) {
  let mocks = {};

  addRootMock(mocks, schema._queryType, mockQueryFn, db, options);
  addRootMock(mocks, schema._mutationType, mockMutationFn, db, options);

const mockRootType = (rootTypes = {}, mockFn, db, schema, options) =>
  Object.keys(rootTypes).reduce((mocks, rootType) =>
    contextSet(mocks, rootType, mockFn(db, schema, options)), {});
