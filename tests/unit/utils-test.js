import * as utils from 'ember-cli-mirage-graphql/utils';
import { module, test } from 'qunit';

module('Unit | utils', function() {
  test('it can push items to an array property of an object and return the object', function(assert) {
    let context = { items: [] };
    let itemToAdd = 1;

    assert.notOk(context.items.length, 'There are no items');

    let result = utils.contextPush(context, 'items', itemToAdd);

    assert.equal(result, context, 'The result is the context');
    assert.equal(context.items[0], itemToAdd, 'The item was added');
  });

  test('it can set a property of an object and return the object', function(assert) {
    let context = {};
    let key = 'foo';
    let value = 'bar';
    let result = utils.contextSet(context, key, value);

    assert.equal(result, context, 'The result is the context');
    assert.equal(result[key], value, 'The value was set');
  });

  test('it can ensure a value is an array', function(assert) {
    let list = [];

    assert.deepEqual(utils.ensureList(), [],
      'Nullish values return empty list (undefined)');
    assert.deepEqual(utils.ensureList(null), [],
      'Nullish values return empty list (null)');
    assert.deepEqual(utils.ensureList(false), [false],
      'Non-list values are wrapped in a list');
    assert.equal(utils.ensureList(list), list, 'Arrays are returned');
  });

  test('it can get the first key of an object', function(assert) {
    let key = 'foo';
    let context = { [key]: 0 };

    assert.equal(utils.getFirstKey(context), key, 'It gets the first key');
  });

  test('it can tell if some value is a function', function(assert) {
    assert.ok(utils.isFunction(() => {}), 'A function is a function');
    assert.notOk(utils.isFunction(1), '1 is not a function');
    assert.notOk(utils.isFunction(true), 'true is not a function');
    assert.notOk(utils.isFunction(''), 'A string is not a function');
    assert.notOk(utils.isFunction(null), 'null is not a function');
    assert.notOk(utils.isFunction(), 'undefined is not a function');
    assert.notOk(utils.isFunction({}), 'An object is not a function');
    assert.notOk(utils.isFunction([]), 'An object is not a function');
  });

  test('it can partially apply arguments to a function', function(assert) {
    let assertSomeThings = (_assert, item) => _assert.ok(item);
    let bestAssertionEver = utils.partial(assertSomeThings, assert);

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
    let pipeline = utils.pipeWithMeta(f1, f2, f3);

    pipeline(assert, meta);
  });

  test('it can reduce the keys of an object', function(assert) {
    let context = { foo: 'bar', bar: 'baz' };
    let result = utils.reduceKeys(context, (str, key) =>
      `${str}|${key}:${context[key]}`, '');

    assert.equal(result, '|foo:bar|bar:baz', 'It formats keys and values');
  });
});
