import { selectedFieldsReducer } from 'ember-cli-mirage-graphql/fields/selections';
import { module, test } from 'qunit';
import { partial } from 'ember-cli-mirage-graphql/utils';

module('Unit | Fields | selections', function() {
  let fieldName = 'Foo';
  let fieldValue = 'foo';
  let getFieldName = () => ({ fieldName });
  let getType = () => {};
  let createFieldInfo = () => fieldValue;
  let reducer = partial(selectedFieldsReducer, getFieldName, getType,
    createFieldInfo, null, null, null);

  test('it creates field info for nested selections', function(assert) {
    let selection = { selectionSet: {} };
    let selections = {};
    let fields = reducer(selections, selection);

    assert.deepEqual(fields, { [fieldName]: fieldValue },
      'It works for nested selections');
  });

  test('it assigns null for scalar fields', function(assert) {
    let selection = {};
    let selections = {};
    let fields = reducer(selections, selection);

    assert.deepEqual(fields, { [fieldName]: null },
      'It assigns null for fields without selection set');
  });
});
