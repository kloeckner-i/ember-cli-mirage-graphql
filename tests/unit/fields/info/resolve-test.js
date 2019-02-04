import { getFieldInfoResolver } from 'ember-cli-mirage-graphql/fields/info/resolve';
import { module, test } from 'qunit';

module('Unit | Fields | Info | resolve', function() {
  test('it resolves fieldInfo by reducing its keys through a pipeline', function(assert) {
    let expectedValue = 'bar';
    let fieldInfo = { foo: { bar: expectedValue } };
    let pipeline = () => fieldInfo.foo.bar;
    let resolveFieldInfo = getFieldInfoResolver(pipeline);
    let resolvedFieldInfo = resolveFieldInfo(fieldInfo);

    assert.deepEqual(resolvedFieldInfo, { foo: expectedValue },
      'It resolved correctly');
  });
});
