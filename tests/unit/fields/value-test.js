import { composeResolveFieldValue } from 'ember-cli-mirage-graphql/fields/value';
import { module, test } from 'qunit';

module('Unit | Field | value', function() {
  test('it resolves field values by field name', function(assert) {
    let field = { type: { name: null } };
    let record = { id: 1 };
    let resolveFieldName = () => null;
    let resolveFieldValue = composeResolveFieldValue(resolveFieldName);
    let value = resolveFieldValue(record, 'id', null, { field });

    assert.equal(value, record.id, 'It resolved the ID');
  });

  test('it resolves field values by resolved field name', function(assert) {
    let field = { type: { name: null } };
    let record = { id: 1 };
    let resolveFieldName = () => 'id';
    let resolveFieldValue = composeResolveFieldValue(resolveFieldName);
    let value = resolveFieldValue(record, null, null, { field });

    assert.equal(value, record.id, 'It resolved the ID');
  });

  test('it resolves field values for __typename', function(assert) {
    let field = { type: { name: 'Foo' } };
    let resolveFieldName = () => null;
    let resolveFieldValue = composeResolveFieldValue(resolveFieldName);
    let value = resolveFieldValue(null, '__typename', null, { field });

    assert.equal(value, field.type.name, 'It resolved the type name');
  });

  test('it resolves field values by field info', function(assert) {
    assert.expect(5);

    function resolveFieldInfo(info, _db, _vars, _options) {
      assert.deepEqual(info, { [fieldName]: fieldValue }, 'It sends field info');
      assert.equal(_db, db, 'It sends the db');
      assert.equal(_vars, vars, 'It sends the vars');
      assert.equal(_options, options, 'It sends the options');

      return info;
    }

    let db = {};
    let field = { type: { name: 'Foo' } };
    let fieldName = 'foo';
    let fieldValue = 'bar';
    let options = {};
    let vars = {};
    let meta = { db, field, options, resolveFieldInfo, vars };
    let resolveFieldName = () => null;
    let resolveFieldValue = composeResolveFieldValue(resolveFieldName);
    let value = resolveFieldValue(null, fieldName, fieldValue, meta);

    assert.equal(value, fieldValue, 'It resolved the field value');
  });
});
