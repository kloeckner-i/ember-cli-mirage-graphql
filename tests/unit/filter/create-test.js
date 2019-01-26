import Filter from 'ember-cli-mirage-graphql/filter/model';
import createFilters from 'ember-cli-mirage-graphql/filter/create';
import { module, test } from 'qunit';

module('Unit | Filter | create', function() {
  test('it can create filters from args', function(assert) {
    let name = 'foo';
    let value = 'bar';
    let field = { args: [{ name, value }], type: { name: '' } };
    let filters = createFilters(field);
    let expectedFilter = Filter.create({ name, value });

    assert.deepEqual(filters, [expectedFilter], 'It created the flter');
  });

  test('it can create filters for vars', function(assert) {
    let kind = 'Variable';
    let name = 'foo';
    let value = 'bar';
    let field = { args: [{ kind, name }], type: { name: '' } };
    let vars = { [name]: value };
    let filters = createFilters(field, vars);
    let expectedFilter = Filter.create({ name, value });

    assert.deepEqual(filters, [expectedFilter], 'It created the flter');
  });

  test('it can create filters for mapped vars', function(assert) {
    let kind = 'Variable';
    let resolvedName = 'baz';
    let name = 'foo';
    let typeName = 'Foo';
    let value = 'bar';
    let field = { args: [{ kind, name }], type: { name: typeName } };
    let options = { varsMap: { [typeName]: { [name]: resolvedName } } };
    let vars = { [name]: value };
    let filters = createFilters(field, vars, options);
    let expectedFilter = Filter.create({ name, resolvedName, value });

    assert.deepEqual(filters, [expectedFilter], 'It created the flter');
  });

  test('it can create filters for mapped function vars', function(assert) {
    let kind = 'Variable';
    let fn = () => {};
    let name = 'foo';
    let typeName = 'Foo';
    let value = 'bar';
    let field = { args: [{ kind, name }], type: { name: typeName } };
    let options = { varsMap: { [typeName]: { [name]: fn } } };
    let vars = { [name]: value };
    let filters = createFilters(field, vars, options);
    let expectedFilter = Filter.create({ hasFnValue: true, fn, name, value });

    assert.deepEqual(filters, [expectedFilter], 'It created the flter');
  });

  test('it can separate relay filters', function(assert) {
    let name = 'foo';
    let value = 'bar';
    let args = [
      { name, value },
      { name: 'after', value: '9' },
      { name: 'before', value: '15' },
      { name: 'first', value: '5' },
      { name: 'last', value: '5' }
    ];
    let field = { args, isRelayEdges: true, type: { name: '' } };
    let filters = createFilters(field);
    let expectedFilter = Filter.create(args[0]);
    let expectedRelayFilters = [
      Filter.create(args[4]),
      Filter.create(args[3]),
      Filter.create(args[2]),
      Filter.create(args[1])
    ];

    assert.deepEqual(filters, [expectedFilter], 'It created one plain flter');
    assert.deepEqual(field.relayFilters, expectedRelayFilters,
      'It separated the relay filters');
  });
});
