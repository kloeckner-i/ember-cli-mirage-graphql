import { getAreRecordsEmpty, getParentRecord } from
  'ember-cli-mirage-graphql/records';
import { module, test } from 'qunit';

module('Unit | records', function() {
  module('empty', function() {
    test('it determines if records are empty', function(assert) {
      assert.ok(getAreRecordsEmpty([]), 'Records are empty');
      assert.ok(getAreRecordsEmpty([{}]), 'It works if first record has no keys');
      assert.notOk(getAreRecordsEmpty([{ id: 1 }]), 'There are records');
    });
  });

  module('parent', function() {
    test('it returns null, if no parent', function(assert) {
      assert.equal(getParentRecord(), null, 'It returns null');
    });

    test('it returns the parent', function(assert) {
      let record = {};
      let parent = { field: {}, record };

      assert.equal(getParentRecord(parent), record, 'It gets the parent');
    });

    test('it returns the grandparent for relay connections', function(assert) {
      let record = {};
      let parent = { field: { isRelayConnection: true, parent: { record } } };

      assert.equal(getParentRecord(parent), record, 'It gets the parent');
    });
  });
});
