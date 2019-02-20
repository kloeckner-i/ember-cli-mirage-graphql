import { composeMapVars, composeMockMutation } from
  'ember-cli-mirage-graphql/mocks/mutation';
import { module, test } from 'qunit';

module('Unit | Mocks | mutation', function() {
  module('mock', function() {
    let records = [];
    let getRecords = () => records;

    test('it creates mutations from options', function(assert) {
      let fieldName = 'foo';
      let mapVars = () => {};
      let meta = { fieldName, returnType: {} };
      let mutationRecords = [];
      let options = {
        mutations: { [fieldName]: () => mutationRecords }
      };
      let mockMutation = composeMockMutation(getRecords, mapVars);
      let mutatedRecords = mockMutation(null, options, null, null, null, meta);

      assert.equal(mutatedRecords, mutationRecords,
        'It returned the mutated records');
    });

    test('it returns records, if no mutation', function(assert) {
      let meta = { returnType: {} };
      let mockMutation = composeMockMutation(getRecords);
      let mutatedRecords = mockMutation(null, {}, null, null, null, meta);

      assert.equal(mutatedRecords, records, 'It returned the records');
    });
  });

  module('vars', function() {
    test('it maps vars by resolved var name', function(assert) {
      let key = 'foo';
      let mappedKey = 'bar';
      let value = 'baz';
      let vars = { [key]: value };
      let resolveVarName = () => mappedKey;
      let mapVars = composeMapVars(resolveVarName);
      let mappedVars = mapVars(vars);

      assert.deepEqual(mappedVars, { [mappedKey]: value }, 'It mapped the vars');
    });
  });
});
