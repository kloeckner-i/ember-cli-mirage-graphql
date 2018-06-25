import MockInfo from 'ember-cli-mirage-graphql/mock/info';
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

  test('it can filter by relay vars: first, after', function(assert) {
    let records = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let relayVars = { first: 4, after: 2 };
    let filteredRecords = filterByRelayVars(records, relayVars);

    assert.deepEqual(filteredRecords, [2, 3, 4, 5]);
  });

  test('it can filter by relay vars: last, before', function(assert) {
    let records = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let relayVars = { last: 4, before: 8 };
    let filteredRecords = filterByRelayVars(records, relayVars);

    assert.deepEqual(filteredRecords, [5, 6, 7, 8]);
  });

  test('it can unwrap the record type from the relay structure', function(assert) {
    let type = { name: 'Foo' };
    let returnType = {
      name: 'FoosConnection',
      _fields: {
        edges: {
          type: {
            ofType: {
              _fields: {
                node: { type }
              }
            }
          }
        },
        pageInfo: {}
      }
    };
    let mockInfo = MockInfo.create({ returnType });

    maybeUnwrapRelayType(mockInfo);

    assert.equal(mockInfo.type, type, 'It has the correct type');
    assert.equal(mockInfo.hasRelay, true, 'It indicates it has relay');
  });

  test('it can wrap records in a relay structure', function(assert) {
    let records = [{ id: 1, foo: 'bar' }, { id: 2, foo: 'baz' }];
    let mockInfo = MockInfo.create({
      hasRelay: true,
      records,
      returnType: { name: 'Foo' }
    });

    maybeWrapForRelay(mockInfo);

    assert.deepEqual(mockInfo.records, [{
      edges: [{
        cursor: 1,
        node: records[0]
      }, {
        cursor: 2,
        node: records[1]
      }],
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: false
      },
      totalCount: 2
    }])
  });
});
