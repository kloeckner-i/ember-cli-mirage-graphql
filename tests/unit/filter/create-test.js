import { composeCreateFilters, composeMapArgsToFilters } from
  'ember-cli-mirage-graphql/filter/create';
import { module, test } from 'qunit';

module('Unit | Filter | create', function() {
  module('args', function() {
    test('it creates a filter', function(assert) {
      let arg = { name: 'foo', value: 'bar' };
      let mapArgsToFilters = composeMapArgsToFilters(x => x);
      let filter = mapArgsToFilters(null, null, arg);

      assert.equal(filter.name, arg.name, 'It mapped the name');
      assert.equal(filter.value, arg.value, 'It mapped the value');
    });

    test('it creates a filter with a function value', function(assert) {
      let arg = { kind: 'Variable', name: 'foo', variableName: 'foo' };
      let fn = () => {};
      let mapArgsToFilters = composeMapArgsToFilters(() => fn);
      let vars = { foo: 'bar' };
      let filter = mapArgsToFilters(vars, null, arg);

      assert.ok(filter.hasFnValue, 'It says it has a function value');
      assert.equal(filter.value, vars.foo, 'It mapped the value');
      assert.equal(filter.fn, fn, 'It has the function');
    });

    test('it resolves mapped variable names', function(assert) {
      let arg = { kind: 'Variable', name: 'foo' };
      let resolvedName = 'mappedVar';
      let mapArgsToFilters = composeMapArgsToFilters(() => resolvedName);
      let vars = { foo: 'bar' };
      let filter = mapArgsToFilters(vars, null, arg);

      assert.equal(filter.resolvedName, resolvedName,
        'It stores the resolved filter name');
    });
  });

  module('filters', function() {
    test('it creates filters for fields', function(assert) {
      let field = {
        args: [{ name: 'foo', value: 'bar' }, { name: 'bar', value: 'baz' }],
        type: { name: 'Foo' }
      };
      let createByArgs = () => field.args;
      let sort = () => 0;
      let createFilters = composeCreateFilters(createByArgs, sort);
      let [filter1, filter2] = createFilters(field);

      assert.deepEqual(filter1, field.args[0], 'It created the 1st filter');
      assert.deepEqual(filter2, field.args[1], 'It created the 2nd filter');
    });

    test('it separates filters for relay edges fields', function(assert) {
      let field = {
        args: [{ name: 'foo', value: 'bar' }, { name: 'bar', value: 'baz' }],
        isRelayEdges: true,
        type: { name: 'Foo' }
      };
      let createByArgs = () => field.args;
      let sort = () => 0;
      let spliceRelayFilters = (filters) => ({
        filters: filters.slice(0, 1),
        relayFilters: filters.slice(1)
      });
      let createFilters =
        composeCreateFilters(createByArgs, sort, spliceRelayFilters);
      let filters = createFilters(field);

      assert.equal(filters.length, 1, 'There is only 1 filter');
      assert.deepEqual(filters, [field.args[0]], 'It kept 1st filter');
      assert.deepEqual(field.relayFilters, [field.args[1]],
        'It spliced 2nd filter');
    });
  });
});
