import { composeCreateFieldInfo } from
  'ember-cli-mirage-graphql/fields/info/create';
import { module, test } from 'qunit';

module('Unit | Fields | Info | create', function() {
  test('it creates field info', function(assert) {
    let mockFieldInfo = {
      args: 'args',
      fields: 'foo',
      isList: false,
      isRelayConnection: false,
      recordType: 'Foo'
    };
    let createFieldInfo = composeCreateFieldInfo(() => mockFieldInfo);
    let fieldInfo = createFieldInfo();

    assert.equal(fieldInfo.args, mockFieldInfo.args, 'It has args');
    assert.equal(fieldInfo.fields, mockFieldInfo.fields, 'It has fields');
    assert.equal(fieldInfo.isList, mockFieldInfo.isList, 'It has isList');
    assert.equal(fieldInfo.type, mockFieldInfo.recordType, 'It has recordType');
    assert.equal(fieldInfo.isRelayConnection, mockFieldInfo.isRelayConnection,
      'It has isRelayConnection');
  });

  test('it moves relay connection args to the edges field', function(assert) {
    let mockFieldInfo = {
      args: ['args'],
      fields: {
        edges: {
          args: [],
          isRelayEdges: false
        }
      },
      isRelayConnection: true,
    };
    let createFieldInfo = composeCreateFieldInfo(() => mockFieldInfo);
    let fieldInfo = createFieldInfo();

    assert.ok(fieldInfo.fields.edges.isRelayEdges, 'It marked the edges field');
    assert.deepEqual(fieldInfo.args, [], 'Args are emptied');
    assert.deepEqual(fieldInfo.fields.edges.args, mockFieldInfo.args,
      'It moved the args');
  });
});
