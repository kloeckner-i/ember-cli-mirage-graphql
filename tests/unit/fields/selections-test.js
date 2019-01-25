import { getSelectedFields } from 'ember-cli-mirage-graphql/fields/selections';
import { module, test } from 'qunit';

module('Unit | Fields | selections', function() {
  test('it gets selected fields for a given type', function(assert) {
    let type = { _fields: { one: {}, two: {}, three: {} } };
    let field = {
      selectionSet: {
        selections: [{
          kind: 'InlineFragment',
          selectionSet: {
            selections: [{
              name: { value: 'one' }
            }]
          }
        }, {
          name: { value: 'two' },
        }, {
          name: { value: 'three' }
        }]
      }
    };
    let selectedFields = getSelectedFields(field, type);

    assert.deepEqual(selectedFields, {
      one: null,
      two: null,
      three: null
    }, 'It gets the selected fields');
  });
});
