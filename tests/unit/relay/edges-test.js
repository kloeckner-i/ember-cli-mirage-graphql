import { composeCreateRelayEdges, composeGetIsEdge, mapRelayEdges } from
  'ember-cli-mirage-graphql/relay/edges';
import { module, test } from 'qunit';

module('Unit | Relay | edges', function() {
  module('map records', function() {
    test('it can map records to relay edges', function(assert) {
      let typeName = 'Foo';
      let records = [{ id: 1 }];
      let edges = mapRelayEdges(records, typeName);

      assert.deepEqual(edges, [{
        cursor: btoa(`${typeName}:${records[0].id}`),
        node: records[0]
      }], 'It created the edges');
    });
  });

  module('create', function() {
    test('it creates edges', function(assert) {
      let field = { fields: {}, isRelayEdges: true };
      let mappedRecords = [{ id: 1 }];
      let mapRelayEdges = () => mappedRecords;
      let createRelayEdges = composeCreateRelayEdges(mapRelayEdges);
      let edges = createRelayEdges(null, { field });

      assert.equal(edges, mappedRecords, 'It created the edges');
    });

    test('it does not create edges for non-edges fields', function(assert) {
      let field = { fields: {}, isRelayEdges: false };
      let records = [{ id: 1 }];
      let createRelayEdges = composeCreateRelayEdges();
      let edges = createRelayEdges(records, { field });

      assert.equal(edges, records, 'It did not create the edges');
    });
  });

  module('get', function() {
    test('it determines if edge based on field', function(assert) {
      let field = {};
      let hasConnectionType = false;
      let getFieldHasConnectionType = () => hasConnectionType;
      let getIsEdge = composeGetIsEdge(getFieldHasConnectionType);

      assert.notOk(getIsEdge('notEdge', field), 'Field name is not "edges"');
      assert.notOk(getIsEdge('edges', field),
        'Field does not have connection type');

      hasConnectionType  = true;

      assert.ok(getIsEdge('edges', field), 'Field has connection type');
    });
  });
});
