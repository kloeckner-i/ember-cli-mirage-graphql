import {
  composeReduceKeys,
  contextPush,
  contextSet,
  ensureList,
  getFirstKey,
  isFunction,
  objectOfType,
  partial,
  pipeWithMeta
} from 'ember-cli-mirage-graphql/utils';
import { module, test } from 'qunit';

module('Unit | utils', function() {
  test('it can push items to an array property of an object and return the object', function(assert) {
    let context = { items: [] };
    let itemToAdd = 1;

    assert.notOk(context.items.length, 'There are no items');

    let result = contextPush(context, 'items', itemToAdd);

    assert.equal(result, context, 'The result is the context');
    assert.equal(context.items[0], itemToAdd, 'The item was added');
  });

  test('it can set a property of an object and return the object', function(assert) {
    let context = {};
    let key = 'foo';
    let value = 'bar';
    let result = contextSet(context, key, value);

    assert.equal(result, context, 'The result is the context');
    assert.equal(result[key], value, 'The value was set');
  });

  test('it can ensure a value is an array', function(assert) {
    let list = [];

    assert.deepEqual(ensureList(), [],
      'Nullish values return empty list (undefined)');
    assert.deepEqual(ensureList(null), [],
      'Nullish values return empty list (null)');
    assert.deepEqual(ensureList(false), [false],
      'Non-list values are wrapped in a list');
    assert.equal(ensureList(list), list, 'Arrays are returned');
  });

  test('it can get the first key of an object', function(assert) {
    let key = 'foo';
    let context = { [key]: 0 };

    assert.equal(getFirstKey(context), key, 'It gets the first key');
  });

  test('it can tell if some value is a function', function(assert) {
    assert.ok(isFunction(() => {}), 'A function is a function');
    assert.notOk(isFunction(1), '1 is not a function');
    assert.notOk(isFunction(true), 'true is not a function');
    assert.notOk(isFunction(''), 'A string is not a function');
    assert.notOk(isFunction(null), 'null is not a function');
    assert.notOk(isFunction(), 'undefined is not a function');
    assert.notOk(isFunction({}), 'An object is not a function');
    assert.notOk(isFunction([]), 'An object is not a function');
  });

  test('it can partially apply arguments to a function', function(assert) {
    let assertSomeThings = (_assert, item) => _assert.ok(item);
    let bestAssertionEver = partial(assertSomeThings, assert);

    bestAssertionEver(true);
  });

  test('it can pipe a main argument and a meta argument through many functions', function(assert) {
    let meta = {};
    let f1 = (_assert, _meta) => {
      _assert.equal(_meta, meta, 'Function 1 got the arguments');
      return _assert;
    };
    let f2 = (_assert, _meta) => {
      _assert.equal(_meta, meta, 'Function 2 got the arguments');
      return _assert;
    };
    let f3 = (_assert, _meta) => {
      _assert.equal(_meta, meta, 'Function 3 got the arguments');
      return _assert;
    };
    let pipeline = pipeWithMeta(f1, f2, f3);

    pipeline(assert, meta);
  });

  test('it can reduce the keys of an object', function(assert) {
    let context = { foo: 'bar', bar: 'baz' };
    let reduceKeys = composeReduceKeys((keys) => keys);
    let result = reduceKeys(context, (str, key) =>
      `${str}|${key}:${context[key]}`, '');

    assert.equal(result, '|foo:bar|bar:baz', 'It formats keys and values');
  });

  test('it can add a type name to an object', function(assert) {
    let key = 'foo';
    let value = 'bar';
    let obj = { [key]: value };
    let typeName = 'Foo';

    assert.deepEqual(objectOfType(obj, typeName), {
      [key]: value,
      __typename: typeName
    }, 'It added the type name');
  });
});
