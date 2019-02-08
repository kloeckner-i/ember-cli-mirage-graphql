import resolveFieldName from 'ember-cli-mirage-graphql/fields/name/resolve';
import { module, test } from 'qunit';

module('Unit | Fields | Name | resolve', function() {
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
