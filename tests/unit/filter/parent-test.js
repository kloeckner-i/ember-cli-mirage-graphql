import { filterByParent } from 'ember-cli-mirage-graphql/filter/parent';
import { module, test } from 'qunit';

module('Unit | Filter | parent', function() {
  test('it returns the records if there is no parent ID', function(assert) {
    let field = {
      parent: {
        field: { type: { name: '' } },
        record: {}
      }
    };
    let records = [];

    assert.equal(filterByParent(records, field), records,
      'It just returns the records');
  });

  test('it works if the parent record has a field for the child', function(assert) {
    let fieldName = 'children';
    let field = {
      parent: {
        field: { type: { name: '' } },
        record: { [fieldName]: [] }
      }
    };

    assert.equal(filterByParent(null, field, fieldName), parent[fieldName],
      'It gets the records from the parent');
  });

  test('it works if the child record has a field for the parent', function(assert) {
    let parentId = 1;
    let field = {
      parent: {
        field: { type: { name: 'Foo' } },
        record: { id: parentId }
      }
    };
    let records = [
      { foo: { id: parentId } },
      { foo: { id: 2 } }
    ];

    assert.deepEqual(filterByParent(records, field), [records[0]],
      'It filters out the 2nd record');
  });

  test('it gets the correct parent for relay edges', function(assert) {
    let fieldName = 'children';
    let field = {
      isRelayEdges: true,
      parent: {
        field: {
          parent: {
            field: { type: { name: '' } },
            record: { [fieldName]: [] }
          },
          type: { name: '' }
        }
      }
    };

    assert.equal(filterByParent(null, field, fieldName), parent[fieldName],
      'It gets the records from the grandparent');
  });
});
