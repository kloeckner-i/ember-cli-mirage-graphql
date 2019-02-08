import { getIsRelayRecord } from 'ember-cli-mirage-graphql/relay/record';
import { module, test } from 'qunit';

module('Unit | Relay | record', function() {
  test('it returns true if field has relayNode', function(assert) {
    let field = { relayNode: true };

    assert.ok(getIsRelayRecord(field));
  });

  test('it returns true if field has relayPageInfo', function(assert) {
    let field = { relayPageInfo: true };

    assert.ok(getIsRelayRecord(field));
  });

  test('it returns false if field has neither', function(assert) {
    let field = { relayNode: false, relayPageInfo: false };

    assert.notOk(getIsRelayRecord(field));
  });
});
