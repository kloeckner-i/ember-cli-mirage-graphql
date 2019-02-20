import { getMappedFieldNameByParentType } from
  'ember-cli-mirage-graphql/fields/name/map';
import { module, test } from 'qunit';

module('Unit | Fields | Name | map', function() {
  test('it can get a mapped field name', function(assert) {
    let fieldName = 'bar';
    let mappedFieldName = 'baz';
    let parentTypeName = 'Foo';
    let fieldsMap = {
      [parentTypeName]: {
        [fieldName]: mappedFieldName
      }
    };
    let parent = { field: { type: { name: parentTypeName } } };
    let mappedField =
      getMappedFieldNameByParentType(fieldName, parent, fieldsMap);

    assert.equal(mappedField, mappedFieldName, 'It mapped the name');
  });
});
