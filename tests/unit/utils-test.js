import { module, test } from 'qunit';
import { reduceKeys } from 'ember-cli-mirage-graphql/utils';

module('Unit | utils', function() {
  test('it can reduce object keys by a function', function(assert) {
    let obj = { bar: true, baz: true };
    let result1 = reduceKeys(obj, (a, b) => `${a}.${b}`, 'foo');
    let result2 = reduceKeys(obj, (a, b) => a ? `${a}.${b}` : b);

    assert.equal(result1, 'foo.bar.baz', 'It works with default value');
    assert.equal(result2, 'bar.baz', 'It works without default value');
  });
});
