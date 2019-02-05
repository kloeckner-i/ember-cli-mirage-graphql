import {
  getFieldName,
  resolveFieldName
} from 'ember-cli-mirage-graphql/fields/name';
import { module, test } from 'qunit';

module('Unit | Fields | name', function() {
  test('it can get a field name or alias', function(assert) {
    let fieldName = 'foo';
    let field = {
      name: { value: fieldName }
    };
    let fieldAlias = 'baz';
    let fieldWithAlias = {
      alias: { value: fieldAlias },
      name: { value: 'bar' }
    };

    assert.equal(getFieldName(field), fieldName, 'It can get a name');
    assert.equal(getFieldName(fieldWithAlias), fieldAlias, 'It can get an alias');
  });

  test('it can resolve a non-mapped field name', function(assert) {
    let fieldName = 'foo';

    assert.equal(resolveFieldName(fieldName), fieldName,
      'It resolved the non-mapped name');
  });

  test('it can resolve a mapped field name', function(assert) {
    let fieldName = 'bar';
    let parentTypeName = 'Foo';
    let resolvedFieldName = 'baz';
    let options = {
      fieldsMap: {
        [parentTypeName]: {
          [fieldName]: resolvedFieldName
        }
      }
    };

    assert.equal(resolveFieldName(fieldName, parentTypeName, options),
      resolvedFieldName, 'It resolved the mapped name');
  });
});
