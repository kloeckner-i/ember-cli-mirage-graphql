import { getIsRelayConnection } from 'ember-cli-mirage-graphql/relay/connection';
import { module, test } from 'qunit';

module('Unit | Relay | connection', function() {
  test('it determines relay connection based on type name and fields', function(assert) {
    let fields = ['edges', 'pageInfo', 'someOtherField'];
    let typeName = 'FooConnection';

    assert.ok(getIsRelayConnection(typeName, fields), 'It is a connection');
  });

  test('it returns false based on type name', function(assert) {
    let fields = ['edges', 'pageInfo'];
    let typeName = 'FooConnectionNot';

    assert.notOk(getIsRelayConnection(typeName, fields), 'It is not a connection');
  });

  test('it returns false based on fields', function(assert) {
    let fields = ['edges'];
    let typeName = 'FooConnection';

    assert.notOk(getIsRelayConnection(typeName, fields), 'It is not a connection');
  });
});
