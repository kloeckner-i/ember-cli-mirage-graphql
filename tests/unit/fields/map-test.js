import { getFieldsForRecordsMapper } from 'ember-cli-mirage-graphql/fields/map';
import { module, test } from 'qunit';

module('Unit | Fields | map', function() {
  const resolveFieldName = (fieldName) => fieldName;

  test('it maps selected fields', function(assert) {
    let record = { id: 1, foo: 'bar' };
    let typeName = 'Foo';
    let field = {
      fields: { id: null, __typename: null },
      type: { name: typeName }
    };
    let getIsRelayNodeField = () => false;
    let map = getFieldsForRecordsMapper(resolveFieldName, getIsRelayNodeField);
    let mappedRecords = map([record], { field });

    assert.deepEqual(mappedRecords, [{ id: 1, __typename: typeName }],
      'It only maps the id and __typename fields');
  });

  test('it sets the field parent', function(assert) {
    let record = { foo: 'bar' };
    let typeName = 'Foo';
    let field = {
      fields: { foo: {} },
      type: { name: typeName }
    };
    let getIsRelayNodeField = () => false;
    let map = getFieldsForRecordsMapper(resolveFieldName, getIsRelayNodeField);

    map([record], { field, resolveFieldInfo: () => ({}) });

    assert.deepEqual(field.fields.foo.parent, { field, record },
      'It sets the parent');
  });

  test('it sets the relay node on the field', function(assert) {
    let node = {};
    let typeName = 'Foo';
    let field = {
      fields: { foo: {} },
      type: { name: typeName }
    };
    let getIsRelayNodeField = () => true;
    let map = getFieldsForRecordsMapper(resolveFieldName, getIsRelayNodeField);

    map([{ node }], { field, resolveFieldInfo: () => ({}) });

    assert.equal(field.fields.foo.relayNode, node, 'It sets the relay node');
  });
});
