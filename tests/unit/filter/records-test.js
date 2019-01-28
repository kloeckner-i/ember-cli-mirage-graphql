import Filter from 'ember-cli-mirage-graphql/filter/model';
import filterRecords from 'ember-cli-mirage-graphql/filter/records';
import { module, test } from 'qunit';

/*
  TODO

  * Consider testing all filters here
    * Create 6 records
    * Add a parent record to filter records down to 5
    * Add a static filter to filter records down to 4
    * Add a variable filter to filter records down to 3
    * Add a mapped variable filter to filter records down to 2
    * Add a mapped variable function to filter records down to 1
    * Add relay filters (first/after and last/before)
 */
module('Unit | Filter | records', function() {
  test('it returns records if empty', function(assert) {
    let records1 = [];
    let records2 = [{}];

    assert.equal(filterRecords(records1), records1, 'It returns empty records');
    assert.equal(filterRecords(records2), records2, 'It returns empty records');
  });

  // TOOD Refactor this as described above
  test('it filters records by static args', function(assert) {
    let name = 'foo';
    let value = 'bar';
    let filters = [new Filter({ name, value })];
    let records = [{ [name]: value }, { [name]: 'baz' }];

    assert.deepEqual(filterRecords(records, filters, {}), [records[0]],
      'It filters out the 2nd record');
  });
});
