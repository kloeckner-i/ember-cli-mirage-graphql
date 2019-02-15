import { selectedFieldsReducer } from 'ember-cli-mirage-graphql/fields/selections';
import { module, test } from 'qunit';
import { partial } from 'ember-cli-mirage-graphql/utils';

module('Unit | Fields | selections', function() {
  module('it creates a hash of selected fields', function() {
    let fieldName = 'Foo';
    let fieldValue = 'foo';
    let getFieldName = () => fieldName;
    let createFieldInfo = () => fieldValue;
    let type = { _fields: { [fieldName]: { type: null } } };
    let reducer = partial(selectedFieldsReducer, getFieldName, createFieldInfo,
      null, type, null);

    test('it creates field info for nested selections', function(assert) {
      let fields = reducer({}, { selectionSet: {} });

      assert.deepEqual(fields, { [fieldName]: fieldValue },
        'It works for nested selections');
    });

    test('it assigns null for scalar fields', function(assert) {
      let fields = reducer({}, {});

      assert.deepEqual(fields, { [fieldName]: null },
        'It assigns null for fields without selection set');
    });
  });
});
