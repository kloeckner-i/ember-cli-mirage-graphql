import { getArgsForField, resolveArgName } from 'ember-cli-mirage-graphql/fields/args';
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
        name: { value: 'foo' },
        value: { kind: 'Variable', name: { value: 'bar' } }
      }]
    };
    let noArgsField = { arguments: [] };

    assert.deepEqual(getArgsForField(noArgsField), [],
      'It can handle a field with no args');
    assert.deepEqual(getArgsForField(fieldWithStaticArgs),
      [{ kind: 'Int', name: 'foo', value: 1, variableName: undefined }],
      'It works with static value args');
    assert.deepEqual(getArgsForField(fieldWithVariableArgs),
      [{ kind: 'Variable', name: 'foo', value: undefined, variableName: 'bar' }],
      'It works with variable value args');
  });

  test('it can get a mapped arg name', function(assert) {
    let argsMap = { foo: 'bar' };

    assert.equal(resolveArgName('foo', argsMap), argsMap.foo,
      'It resolved the mapped name');
  });

  test('it resolves arg name, if not mapped', function(assert) {
    assert.equal(resolveArgName('foo'), 'foo', 'It resolved the name');
  });
});
