import mockMutation from './mutation';
import mockQuery from './query';
import { contextSet, partial, reduceKeys } from '../utils';

const createMocks = (typesAndMockFns, db, options) =>
  typesAndMockFns.reduce(partial(reduceMocks, mockRootType, db, options), {});

export const composeCreateMocksForSchema =
  (createMocks, mockQuery, mockMutation) =>
    (schema, db, options) => {
      let typesAndMockFns = [
        [schema._queryType, mockQuery],
        [schema._mutationType, mockMutation]
      ];
      let mocks = createMocks(typesAndMockFns, db, options);

      return mocks;
    };

const mockRootType = (fields = {}, mockFn, db, options) =>
  reduceKeys(fields, (mocks, field) =>
    contextSet(mocks, field, partial(mockFn, db, options)), {});

export const reduceMocks =
  (mockRootType, db, options, mocks, [{ _fields, name }, mockFn]) =>
    contextSet(mocks, name, () => mockRootType(_fields, mockFn, db, options));

const createMocksForSchema =
  composeCreateMocksForSchema(createMocks, mockQuery, mockMutation);

export default createMocksForSchema;
