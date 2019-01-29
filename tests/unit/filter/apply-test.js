import Filter from 'ember-cli-mirage-graphql/filter/model';
import applyFilters from 'ember-cli-mirage-graphql/filter/apply';
import { module, test } from 'qunit';

module('Unit | Filter | apply', function() {
  test('it can filter records by name/value', function(assert) {
    let name = 'foo';
    let value = 'bar';
    let filters = [Filter.create({ name, value })];
    let records = [
      { [name]: value },
      { [name]: 'baz' }
    ];
    let filteredRecords = applyFilters(records, { filters });

    assert.deepEqual(filteredRecords, [records[0]], 'It filtered the records');
  });

  test('it can filter records by functions', function(assert) {
    let filters = [
      Filter.create({
        fn: ([firstRecord]) => [firstRecord],
        hasFnValue: true
      })
    ];
    let records = [
      { foo: 'bar' },
      { foo: 'baz' }
    ];
    let filteredRecords = applyFilters(records, { filters });

    assert.deepEqual(filteredRecords, [records[0]], 'It filtered the records');
  });
});
