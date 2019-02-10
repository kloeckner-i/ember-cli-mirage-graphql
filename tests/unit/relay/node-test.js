import { composeGetNodeField, getIsRelayNodeField } from
  'ember-cli-mirage-graphql/relay/node';
import { module, test } from 'qunit';

module('Unit | Relay | node', function() {
  module('get field', function() {
    test('it gets a node field from an edge field', function(assert) {
      let field = { fields: { node: {} } };
      let getIsEdge = () => true;
      let getNodeField = composeGetNodeField(getIsEdge);
      let nodeField = getNodeField(null, field);

      assert.equal(nodeField, field.fields.node, 'It got the field');
    });

    test('it does not get node fields from non-edge fields', function(assert) {
      let field = { fields: { node: {} } };
      let getIsEdge = () => false;
      let getNodeField = composeGetNodeField(getIsEdge);
      let nodeField = getNodeField(null, field);

      assert.equal(nodeField, false, 'It did not get the field');
    });
  });

  module('is field', function() {
    test('it determines if fields are relay node fields', function(assert) {
      assert.notOk(getIsRelayNodeField('notNode', { isRelayEdges: true  }),
        'The field name must be "node"');
      assert.notOk(getIsRelayNodeField('node', { isRelayEdges: false }),
        'The options must indicate relay edges');
      assert.ok(getIsRelayNodeField('node', { isRelayEdges: true }),
        'The field name is "node" and options indicate relay edges');
    });
  });
});
