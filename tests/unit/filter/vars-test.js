import { module, test } from 'qunit';
import { resolveVarName } from 'ember-cli-mirage-graphql/filter/vars';

module('Unit | Fields | vars', function() {
  test('it can get a mapped variable name', function(assert) {
    let varsMap = { foo: 'bar' };

    assert.equal(resolveVarName('foo', varsMap), varsMap.foo,
      'It resolved the mapped name');
  });

  test('it resolves variable name, if not mapped', function(assert) {
    assert.equal(resolveVarName('foo'), 'foo', 'It resolved the name');
  });
});
