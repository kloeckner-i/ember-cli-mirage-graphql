import { getFieldsMapForType } from 'ember-cli-mirage-graphql/fields/map/type';
import { module, test } from 'qunit';

module('Unit | Fields | type', function() {
  test('it gets the fields map for a parent type', function(assert) {
    let fieldMap = { bar: 'baz' };
    let typeName = 'Foo';
    let fieldsMap = { [typeName]: fieldMap };
    let parent = { field: { type: { name: typeName } } };

    assert.equal(getFieldsMapForType(parent, fieldsMap), fieldMap,
      'It gets the fields map for "Foo"');
  });

  test('it gets the whole fields map, if no parent type', function(assert) {
    let fieldsMap = {};

    assert.equal(getFieldsMapForType(null, fieldsMap), fieldsMap,
      'It gets the whole fields map');
  });
});
