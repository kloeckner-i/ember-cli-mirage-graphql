import { composeFieldsReducer, composeMapFieldsForRecords } from
  'ember-cli-mirage-graphql/fields/map/records';
import { module, test } from 'qunit';

module('Unit | Fields | Map | records', function() {
  test('it maps selected fields', function(assert) {
    let record = { id: 1, foo: 'bar' };
    let fields = { id: null };
    let getIsRelayNodeField = () => false;
    let resolveFieldValue = () => record.id;
    let reducer = composeFieldsReducer(getIsRelayNodeField, resolveFieldValue);
    let mapper = composeMapFieldsForRecords(reducer);
    let mappedRecords = mapper([record], { field: { fields } });

    assert.deepEqual(mappedRecords[0], { id: record.id }, 'It mapped the ID');
  });

  test('it sets the field parent', function(assert) {
    let record = { foo: 'bar' };
    let field = { fields: { foo: {} } };
    let getIsRelayNodeField = () => false;
    let resolveFieldValue = () => {};
    let reducer = composeFieldsReducer(getIsRelayNodeField, resolveFieldValue);
    let mapper = composeMapFieldsForRecords(reducer);

    mapper([record], { field });

    assert.deepEqual(field.fields.foo.parent, { field, record },
      'It sets the parent');
  });

  test('it sets the relay node on the field', function(assert) {
    let node = {};
    let field = { fields: { foo: {} } };
    let getIsRelayNodeField = () => true;
    let resolveFieldValue = () => {};
    let reducer = composeFieldsReducer(getIsRelayNodeField, resolveFieldValue);
    let mapper = composeMapFieldsForRecords(reducer);

    mapper([{ node }], { field });

    assert.equal(field.fields.foo.relayNode, node, 'It sets the relay node');
  });
});
