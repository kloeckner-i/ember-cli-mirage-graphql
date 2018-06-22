import {
  abstractRelayVars,
  filterByRelayVars,
  maybeUnwrapRelayType,
  maybeWrapForRelay
} from 'ember-cli-mirage-graphql/relay-pagination';
import { module, test } from 'qunit';

module('Unit | relay pagination', function() {
  test('it can abstract relay variables', function(assert) {
    let originalVars = {
      before: 10,
      after: 0,
      first: 10,
      last: 0,
      foo: 'bar'
    };

    let { relayVars, vars } = abstractRelayVars(originalVars);

    assert.deepEqual(relayVars, { before: 10, after: 0, first: 10, last: 0 },
      'Relay vars were abstracted');
    assert.deepEqual(vars, { foo: 'bar' }, 'Other vars remain');
  });
});
