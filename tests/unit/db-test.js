import * as db from 'ember-cli-mirage-graphql/db';
import { module, test } from 'qunit';

module('Unit | db', function() {
  test('it can get records for a Mirage db by table name', function(assert) {
    let records = [{ id: 1 }]
    let _db = { foos: records };

    assert.equal(db.getRecords(_db, 'Foo'), records, 'It got the records');
  });

  test('it can get a table name by type name', function(assert) {
    let typeName1 = 'Foo';
    let typeName2 = 'Person';

    assert.equal(db.getTableName(typeName1), 'foos',
      `It got the table name for "${typeName1}"`);
    assert.equal(db.getTableName(typeName2), 'people',
      `It got the table name for "${typeName2}"`);
  });
});
