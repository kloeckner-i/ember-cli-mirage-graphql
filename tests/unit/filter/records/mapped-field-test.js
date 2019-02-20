import { composeFilterRecordsByMappedField } from
  'ember-cli-mirage-graphql/filter/records/mapped-field';
import { module, test } from 'qunit';

module('Unit | Filter | Records | mapped field', function() {
  test('it returns records if field not mapped to function', function(assert) {
    let getFieldsMapForType = () => null;
    let filterRecordsByMappedField =
      composeFilterRecordsByMappedField(getFieldsMapForType);
    let field = { parent: null };
    let records = [{}];
    let filteredRecords = filterRecordsByMappedField(records, { field });

    assert.equal(records, filteredRecords, 'It returned the records');
  });

  test('it calls mapped field function', function(assert) {
    assert.expect(4);

    let db = {};
    let fieldName = 'foo';
    let parent = {};
    let records = [{}];

    function mapField(_records, _db, _parent) {
      assert.equal(_records, records, 'It sends the records');
      assert.equal(_db, db, 'It sends the db');
      assert.equal(_parent, parent, 'It sends the parent');

      return _records;
    }

    let getFieldsMapForType = () => ({ [fieldName]: mapField });
    let getParentRecord = () => parent;
    let filterRecordsByMappedField =
      composeFilterRecordsByMappedField(getFieldsMapForType, getParentRecord);
    let field = { parent: null };
    let meta = { db, field, fieldName }
    let filteredRecords = filterRecordsByMappedField(records, meta);

    assert.equal(records, filteredRecords, 'It returned the records');
  });
});
