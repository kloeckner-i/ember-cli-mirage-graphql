import { getFieldNameAndAlias } from 'ember-cli-mirage-graphql/fields/name';
import { module, test } from 'qunit';

module('Unit | Fields | name', function() {
  test('it can get a field name and alias', function(assert) {
    let fieldAlias = 'bar';
    let fieldName = 'foo';
    let field = {
      alias: { value: fieldAlias },
      name: { value: fieldName }
    };

    assert.deepEqual(getFieldNameAndAlias(field), { fieldAlias, fieldName },
      'It can get the field name and alias');
  });
});
