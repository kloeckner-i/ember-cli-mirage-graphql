import { module, test } from 'qunit';
import { contextSet, isFunction, pipe } from
  'ember-cli-mirage-graphql/utils';

module('Unit | utils', function() {
  test('contextSet sets object property and returns object', function(assert) {
    let obj = { foo: 'bar' };

    assert.deepEqual(contextSet(obj, 'foo', 'baz'), { foo: 'baz' });
  });

  test('isFunction tests if an argument is a function', function(assert) {
    let obj = {};
    let testValues = [null, obj, 0, ''];

    testValues.forEach((v) => assert.notOk(isFunction(v),
      `${v} is not a function`));

    assert.notOk(isFunction(obj.foo), 'undefined is not a function');

    assert.ok(isFunction(() => {}), 'A function is a function');
  });

  test('pipe returns a function that pipes an argument through n functions', function(assert) {
    let testValue = 1;
    let double = (v) => v * 2;
    let square = (v) => v * v;
    let doubleThenSquare = pipe(double, square);

    assert.equal(doubleThenSquare(testValue), 4);
  });
});
