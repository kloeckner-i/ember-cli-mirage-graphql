import { createRelayEdges, getIsEdge } from 'ember-cli-mirage-graphql/relay/edges';
import { module, test } from 'qunit';

module('Unit | Relay | edges', function() {
  test('it can create edges from records', function(assert) {
    let typeName = 'Foo';
    let field = {
      fields: { node: { type: { name: typeName } } },
      isRelayEdges: true
    };
    let records = [{ id: 1 }];
    let edges = createRelayEdges(records, { field });

    assert.deepEqual(edges, [{
      cursor: btoa(`${typeName}:${records[0].id}`),
      node: records[0]
    }], 'It created the edges');
  });

  test('it does not create edges for non-edges fields', function(assert) {
    let field = { fields: {}, isRelayEdges: false };
    let records = [{ id: 1 }];
    let edges = createRelayEdges(records, { field });

    assert.equal(edges, records, 'It did not create the edges');
  });

  test('it determines if edge based on field', function(assert) {
    let field = { parent: { field: { type: { name: 'FooConnection' } } } };

    assert.notOk(getIsEdge('notEdge'), 'Field name is not "edges"');
    assert.ok(getIsEdge('edges', field), 'Field is "edges"');
  });
});
