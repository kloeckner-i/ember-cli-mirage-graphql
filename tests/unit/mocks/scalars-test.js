import createMocksForSchema from
  'ember-cli-mirage-graphql/mocks/create';
import { module, test } from 'qunit';

module('Unit | Mocks | scalars', function() {
  module('mock', function() {

    test('creates scalars from options', function(assert) {
      let schema = { _mutationType: {}, _queryType: {} };
      let db = {};
      let fieldName = 'foo';
      let value = 'custom value'
      let scalarMock = () => value;
      let options = {
        scalarMocks: { [fieldName]: scalarMock }
      };
      const mocks = createMocksForSchema(schema, db, options);

      assert.equal(typeof mocks[fieldName], 'function', 'mock scalar set on mocks');
      assert.equal(mocks[fieldName](), value, 'custom scalar returns proper value');
    });
  });
});
