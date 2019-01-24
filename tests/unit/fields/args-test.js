import { getArgsForField } from 'ember-cli-mirage-graphql/fields/args';
import { module, test } from 'qunit';

module('Unit | Fields | args', function() {
  test('it can generate args from a field for FieldInfo', function(assert) {
    let fieldWithStaticArgs = {
      arguments: [{
        name: { value: 'foo' },
        value: { kind: 'Int', value: 1 }
      }]
    };
    let fieldWithVariableArgs = {
      arguments: [{
        value: { kind: 'Variable', name: { value: 'bar' } }
      }]
    };
    let noArgsField = { arguments: [] };

    assert.deepEqual(getArgsForField(noArgsField), [],
      'It can handle a field with no args');
    assert.deepEqual(getArgsForField(fieldWithStaticArgs),
      [{ kind: 'Int', name: 'foo', value: 1 }],
      'It works with static value args');
    assert.deepEqual(getArgsForField(fieldWithVariableArgs),
      [{ kind: 'Variable', name: 'bar', value: undefined }],
      'It works with variable value args');
  });
});
