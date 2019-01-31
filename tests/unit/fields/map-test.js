import { getMapperForRecordFields } from 'ember-cli-mirage-graphql/fields/map';
import { module, test } from 'qunit';

module('Unit | Fields | map', function() {
  test('it maps records by selected scalar fields', function(assert) {
    let field = {
      fields: { foo: null, bar: null },
      type: { name: 'Foo' }
    };
    let records = [{ foo: 1, bar: 2, baz: 3 }];
    let mapper = getMapperForRecordFields();
    let mappedRecords = mapper(records, { field });

    assert.deepEqual(mappedRecords, [
      { foo: 1, bar: 2 }
    ], 'It only took 2 fields from the record');
  });
});
