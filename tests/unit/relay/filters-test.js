import Filter from 'ember-cli-mirage-graphql/filter/model';
import { applyRelayFilters } from 'ember-cli-mirage-graphql/relay/filters';
import { module, test } from 'qunit';

const FIELD = {
  isRelayEdges: true,
  parent: { field: { fields: { pageInfo: {} } } },
  type: { name: 'Foo' }
};

module('Unit | Relay | filters', function() {
  test('it returns records if no relay edges', function(assert) {
    let field = { isRelayEdges: false };
    let records = [];

    assert.equal(applyRelayFilters(records, { field }), records,
      'It returned the records');
  });

  test('it can filter by first/after', function(assert) {
    let relayFilters = [
      Filter.create({ name: 'first', value: 2 }),
      Filter.create({ name: 'after', value: '1' })
    ];
    let field = Object.assign(FIELD, { relayFilters });
    let records = [{ id: '1' }, { id: '2' }, { id: '3' }];
    let filteredRecords = applyRelayFilters(records, { field });
    let { relayPageInfo } = field.parent.field.fields.pageInfo;

    assert.deepEqual(filteredRecords, records.slice(1),
      'It returned the last 2 records');
    assert.deepEqual(relayPageInfo, {
      hasNextPage: false,
      hasPreviousPage: true
    }, 'It sets the pageInfo on the parent connection field');
  });

  test('it can filter by last/before', function(assert) {
    let relayFilters = [
      Filter.create({ name: 'last', value: 2 }),
      Filter.create({ name: 'before', value: '3' })
    ];
    let field = Object.assign(FIELD, { relayFilters });
    let records = [{ id: '1' }, { id: '2' }, { id: '3' }];
    let filteredRecords = applyRelayFilters(records, { field });
    let { relayPageInfo } = field.parent.field.fields.pageInfo;

    assert.deepEqual(filteredRecords, records.slice(0, 2),
      'It returned the first 2 records');
    assert.deepEqual(relayPageInfo, {
      hasNextPage: true,
      hasPreviousPage: false
    }, 'It sets the pageInfo on the parent connection field');
  });
});
