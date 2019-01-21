import getMockMutation from './mutation';
import getMockQuery from './query';
import { contextSet, reduceKeys } from '../utils';

const getMocksReducer = (db, options) =>
  (mocks, [{ _fields, name }, mockFn]) =>
    contextSet(mocks, name, () =>
      mockRootType(_fields, mockFn, db, options));

const mockRootType = (fields = {}, mockFn, db, options) =>
  reduceKeys(fields, (mocks, field) =>
    contextSet(mocks, field, mockFn(db, options)), {});

export const createMocksForSchema = (schema, db, options) =>
  [[schema._queryType, getMockQuery], [schema._mutationType, getMockMutation]]
    .reduce(getMocksReducer(db, options), {});
