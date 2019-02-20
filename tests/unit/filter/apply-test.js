import { composeReduceRecordsByFilter, filterBy } from
  'ember-cli-mirage-graphql/filter/apply';
import { module, test } from 'qunit';

module('Unit | Filter | apply', function() {
  module('filter by', function() {
    test('it can filter records by key/value', function(assert) {
      let records = [{ foo: 'bar' }, { foo: 'baz' }];
      let filteredRecords = filterBy(records, 'foo', 'bar');

      assert.deepEqual(filteredRecords, [records[0]], 'It filtered records');
    });
  });

  module('reduce by filter', function() {
    test('it skips filters with null values', function(assert) {
      let records = [{ foo: 'bar' }, { foo: 'baz' }];
      let filter = {};
      let reducer = composeReduceRecordsByFilter();
      let filteredRecords = reducer(records, filter);

      assert.equal(filteredRecords, records, 'It returned the records');
    });

    test('it can work with function filters', function(assert) {
      let records = [{ foo: 'bar' }, { foo: 'baz' }];
      let filter = { hasFnValue: true, fn: () => records[0] };
      let reducer = composeReduceRecordsByFilter();
      let filteredRecords = reducer(records, filter);

      assert.equal(filteredRecords, records[0], 'It filtered by function');
    });

    test('it can work with non-function filters', function(assert) {
      let records = [{ foo: 'bar' }, { foo: 'baz' }];
      let filter = { name: 'foo', value: 'bar' };
      let filterBy = () => records[0];
      let reducer = composeReduceRecordsByFilter(filterBy);
      let filteredRecords = reducer(records, filter);

      assert.equal(filteredRecords, records[0], 'It filtered records');
    });
  });
});
