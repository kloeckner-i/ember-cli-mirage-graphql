import MockInfo from 'ember-cli-mirage-graphql/mock/info';
import { GraphQLList, GraphQLObjectType } from 'graphql';
import { module, test } from 'qunit';

module('Unit | mock | info', function() {
  test('it sets its own type and mirageType properties (object type)', function(assert) {
    let returnType = { name: 'Foo' };
    let mockInfo = MockInfo.create({ returnType });

    assert.equal(mockInfo.type, returnType, 'The type is set');
    assert.equal(mockInfo.mirageType, 'foo', 'The Mirage type is set');
  });

  test('it sets its own type and mirageType properties (list type)', function(assert) {
    let type = new GraphQLObjectType({ name: 'Foo' });
    let returnType = new GraphQLList(type);
    let mockInfo = MockInfo.create({ returnType });

    assert.equal(mockInfo.type, type, 'The type is set');
    assert.equal(mockInfo.mirageType, 'foo', 'The Mirage type is set');
  });
});
