import { composeFilterRecords } from 'ember-cli-mirage-graphql/filter/records';
import { module, test } from 'qunit';

module('Unit | Filter | records', function() {
  test('it returns records if empty', function(assert) {
    let getAreRecordsEmpty = () => true;
    let filterRecords = composeFilterRecords(getAreRecordsEmpty);
    let records = [{}];
    let filteredRecords = filterRecords(records, {});

    assert.equal(filteredRecords, records, 'It returns the records');
  });

  test('it returns records if relay records', function(assert) {
    let getAreRecordsEmpty = () => false;
    let getIsRelayRecord = () => true;
    let filterRecords = composeFilterRecords(getAreRecordsEmpty, getIsRelayRecord);
    let records = [{}];
    let filteredRecords = filterRecords(records, {});

    assert.equal(filteredRecords, records, 'It returns the records');
  });
});
