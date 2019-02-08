import getFieldName from 'ember-cli-mirage-graphql/fields/name';
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
});
