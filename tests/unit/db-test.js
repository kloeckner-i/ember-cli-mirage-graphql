import { composeGetRecords, composeGetTableNameForField, getTableName } from
  'ember-cli-mirage-graphql/db';
import { module, test } from 'qunit';

module('Unit | db', function() {
  module('get records', function() {
    test('it can get records for a Mirage db by table name', function(assert) {
      let records = [{ id: 1 }];
      let tableName = 'foos';
      let db = { [tableName]: records };
      let getTableName = () => tableName;
      let getRecords = composeGetRecords(getTableName);

      assert.equal(getRecords(db), records, 'It got the records');
    });
  });

  module('get table by field', function() {
    test('it can get the table name for a field', function(assert) {
      let tableName = 'foos';
      let getMappedFieldName = () => {};
      let getTableName = () => tableName;
      let getTableNameForField =
        composeGetTableNameForField(getMappedFieldName, getTableName);

      assert.equal(getTableNameForField(), tableName, 'It got the table name');
    });

    test('it can get the table name for a mapped field', function(assert) {
      let mappedTableName = 'bars';
      let getMappedFieldName = () => mappedTableName;
      let getTableNameForField = composeGetTableNameForField(getMappedFieldName);

      assert.equal(getTableNameForField(), mappedTableName, 'It got the table name');
    });
  });

  module('table name', function() {
    test('it can get a tab`le name by type name', function(assert) {
      let typeName1 = 'Foo';
      let typeName2 = 'Person';

      assert.equal(getTableName(typeName1), 'foos',
        `It got the table name for "${typeName1}"`);
      assert.equal(getTableName(typeName2), 'people',
        `It got the table name for "${typeName2}"`);
    });
  });
});
