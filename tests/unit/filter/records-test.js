import filterRecords from 'ember-cli-mirage-graphql/filter/records';
import { module, test } from 'qunit';

module('Unit | Filter | records', function() {
  test('it returns records if empty', function(assert) {
    let records1 = [];
    let records2 = [{}];

    assert.equal(filterRecords(records1), records1, 'It returns empty records');
    assert.equal(filterRecords(records2), records2, 'It returns empty records');
  });
});
