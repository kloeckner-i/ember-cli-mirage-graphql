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

/*
  TODO

  Interesting road block here. GraphQL calls the mock function for interface
  types even though we already mocked the root type. Not sure why but we have
  to deal with it.

  How?

  1. Identify interface type fields when mocking
  2. When encountering an interface type field
   * Attach its data to the options hash
  3. Iterate over interface type fields here
   * Return data from options hash

  If this works, remove options = {} from child code.
 */
export const createMocksForSchema = (schema, db, options = {}) =>
  [[schema._queryType, getMockQuery], [schema._mutationType, getMockMutation]]
    .reduce(getMocksReducer(db, options), {
      Node(_, __, ___, { path }) {
        return options.interfaceMocks.Node.fn(path.key);
      }
    });
