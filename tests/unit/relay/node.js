import { getIsRelayNodeField } from 'ember-cli-mirage-graphql/relay/node';
import { module, test } from 'qunit';

module('Unit | Relay | node', function() {
  test('it determines if fields are relay node fields', function(assert) {
    assert.notOk(getIsRelayNodeField('notNode', { isRelayEdges: true  }),
      'The field name must be "node"');
    assert.notOk(getIsRelayNodeField('node', { isRelayEdges: true }),
      'The options must indicate relay edges');
    assert.ok(getIsRelayNodeField('node', { isRelayEdges: true }),
      'The field name is "node" and options indicate relay edges');
  });
});
