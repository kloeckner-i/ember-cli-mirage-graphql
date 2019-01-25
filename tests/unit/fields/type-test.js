import { GraphQLInterfaceType, GraphQLList, GraphQLObjectType } from 'graphql';
import { getTypeForField } from 'ember-cli-mirage-graphql/fields/type';
import { module, test } from 'qunit';

module('Unit | Fields | type', function() {
  test('it gets the type for a field', function(assert) {
    let type = {};
    let { isList, recordType } = getTypeForField(null, null, type);

    assert.equal(isList, false, 'Type is not a list type');
    assert.equal(recordType, type, 'The type is returned');
  });

  test('it gets the type for an interface type field', function(assert) {
    let type = {};
    let typeName = 'Foo';
    let typeMap = { [typeName]: type };
    let field = {
      selectionSet: {
        selections: [{
          kind: 'InlineFragment',
          typeCondition: {
            name: { value: typeName }
          }
        }]
      }
    };
    let interfaceType = new GraphQLInterfaceType({ name: '' });
    let { isList, recordType } = getTypeForField(typeMap, field, interfaceType);

    assert.equal(isList, false, 'Type is not a list type');
    assert.equal(recordType, type, 'The concrete type is returned');
  });

  test('it gets the type for a list type field', function(assert) {
    let type = new GraphQLObjectType({ name: '' });
    let listType = new GraphQLList(type);
    let { isList, recordType } = getTypeForField(null, null, listType);

    assert.equal(isList, true, 'Type is not a list type');
    assert.equal(recordType, type, 'The concrete type is returned');
  });
});
