import MockInfo from 'ember-cli-mirage-graphql/mock/info';
import { getRecordsByType } from 'ember-cli-mirage-graphql/db';
import { module, test } from 'qunit';

module('Unit | db', function() {
  test('it can get records by type', function(assert) {
    let db = {
      foos: [{
        id: 1,
        foo: 'bar'
      }, {
        id: 2,
        foo: 'baz'
      }]
    };
    let returnType = { name: 'Foo' };
    let mockInfo = MockInfo.create({ returnType });
    let getRecords = getRecordsByType(db);

    assert.deepEqual(getRecords(mockInfo).get('records'), db.foos);
  });
});
