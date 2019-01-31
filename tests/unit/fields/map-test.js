import { getMapperForRecordFields } from 'ember-cli-mirage-graphql/fields/map';
import { module, test } from 'qunit';

module('Unit | Fields | map', function() {
  test('it maps records by selected fields', function(assert) {
    let typeName = 'Foo';
    let field = {
      fields: { foo: null, bar: null, __typename: null },
      type: { name: typeName }
    };
    let mapper = getMapperForRecordFields();
    let records = [{ foo: 1, bar: 2, baz: 3 }];
    let [mappedRecord] = mapper(records, { field });

    assert.deepEqual(mappedRecord, { foo: 1, bar: 2, __typename: typeName },
      'It only took 2 fields from the record and typename');
  });

  test('it maps nested fields via resolver function', function(assert) {
    assert.expect(5);

    let db = {};
    let fieldName = 'foo';
    let value = {};
    let field = { fields: { [fieldName]: value }, type: { name: 'Foo' } };
    let options = {};
    let records = [{}];
    let vars = {};

    function mockFieldResolver(fieldInfo, _db, _vars, _options) {
      assert.equal(_db, db, 'Field resolver received db');
      assert.equal(_vars, vars, 'Field resolver received vars');
      assert.equal(_options, options, 'Field resolver received options');
      assert.deepEqual(fieldInfo, { [fieldName]: value },
        'Field resolver received fieldInfo');

      return {};
    }

    let mapper = getMapperForRecordFields(mockFieldResolver);

    mapper(records, { db, field, options, vars });

    assert.deepEqual(field.fields[fieldName].parent,
      {
        field,
        record: records[0]
      }, 'It set the parent on the field');
  });

  test('it sets relayNode on the field, if it finds one', function(assert) {
    let field = {
      fields: { node: {} },
      isRelayEdges: true,
      type: { name: 'Foo' }
    };
    let mapper = getMapperForRecordFields(() => ({}));
    let node = {};
    let records = [{ node }];

    mapper(records, { field });

    assert.equal(field.fields.node.relayNode, node, 'It set the node');
  });
});
