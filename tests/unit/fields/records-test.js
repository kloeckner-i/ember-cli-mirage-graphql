import { composeGetRecordsByField, composeGetRecordsByFieldName } from
  'ember-cli-mirage-graphql/fields/records';
import { module, test } from 'qunit';

module('Unit | Fields | records', function() {
  module('field', function() {
    test('it returns relay nodes, if on field', function(assert) {
      let field = { relayNode: {} };
      let getRecordsByField = composeGetRecordsByField();
      let records = getRecordsByField(null, { field });

      assert.deepEqual(records, [field.relayNode], 'It retured the node');
    });

    test('it returns relay page info, if on field', function(assert) {
      let field = { relayPageInfo: {} };
      let getRecordsByField = composeGetRecordsByField();
      let records = getRecordsByField(null, { field });

      assert.deepEqual(records, [field.relayPageInfo], 'It retured page info');
    });

    test('it gets records by field name', function(assert) {
      let field = {};
      let record = 'foo';
      let getRecordsByFieldName = () => record;
      let getRecordsByField = composeGetRecordsByField(getRecordsByFieldName);
      let records = getRecordsByField(null, { field });

      assert.equal(records, record, 'It retured the record');
    });
  });

  module('field name', function() {
    test('it gets records by field name using field type', function(assert) {
      let field = { type: { name: 'Foo' } };
      let getNodeField = () => {};
      let tableName = 'foos';
      let getTableNameForField = () => tableName;
      let tableRecords = [{}];
      let db = { [tableName]: tableRecords };
      let getRecordsByFieldName =
        composeGetRecordsByFieldName(getNodeField, getTableNameForField);
      let records = getRecordsByFieldName(null, field, db);

      assert.deepEqual(records, tableRecords, 'It returned the records');
    });

    test('it gets records by field name using relay node field type', function(assert) {
      let getNodeField = () => ({ type: { name: 'Foo' } });
      let tableName = 'foos';
      let getTableNameForField = () => tableName;
      let tableRecords = [{}];
      let db = { [tableName]: tableRecords };
      let getRecordsByFieldName =
        composeGetRecordsByFieldName(getNodeField, getTableNameForField);
      let records = getRecordsByFieldName(null, {}, db);

      assert.deepEqual(records, tableRecords, 'It returned the records');
    });
  });
});
