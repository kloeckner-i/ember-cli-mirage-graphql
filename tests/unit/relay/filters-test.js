import {
  composeApplyRelayFilters,
  composeSetRelayPageInfo,
  composeSpliceRelayFilters,
  getFilterTypeToSet,
  getRelayFiltersFromField
} from 'ember-cli-mirage-graphql/relay/filters';
import { module, test } from 'qunit';

module('Unit | Relay | filters', function() {
  module('page info', function() {
    test('it sets relay page info on a parent field', function(assert) {
      let pageInfoField = { relayPageInfo: null };
      let pageInfo = {};
      let createPageInfo = () => pageInfo;
      let setRelayPageInfo = composeSetRelayPageInfo(createPageInfo);

      setRelayPageInfo(pageInfoField);

      assert.equal(pageInfoField.relayPageInfo, pageInfo, 'It set the page info');
    });
  });

  module('get from field', function() {
    test('it maps list of filters to hash', function(assert) {
      let relayFilters = [
        { name: 'after', value: '1' },
        { name: 'first', value: '10' },
        { name: 'before', value: null },
        { name: 'last', value: null }
      ];
      let filtersFromField = getRelayFiltersFromField({ relayFilters });

      assert.deepEqual(filtersFromField, { after: 1, first: 10 },
        'It mapped filters with values');
    });
  });

  module('apply', function() {
    test('it applies after, before, first and last filters', function(assert) {
      let field = { relayFilters: {} };
      let getRelayFiltersFromField = () => ({
        after: 1,
        before: 9,
        first: 5,
        last: 2
      });
      let records = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((r) => ({ id: r }));
      let setRelayPageInfo = () => {};
      let applyRelayFilters =
        composeApplyRelayFilters(getRelayFiltersFromField, setRelayPageInfo);
      let filteredRecords = applyRelayFilters(records, { field });

      assert.deepEqual(filteredRecords, records.slice(4, 6),
        'It applied filters in the correct order');
    });

    test('it returns records, if no relay filters', function(assert) {
      let field = {};
      let noop = () => {};
      let records = [];
      let applyRelayFilters = composeApplyRelayFilters(noop, noop);
      let filteredRecords = applyRelayFilters(records, { field });

      assert.equal(filteredRecords, records, 'It returned the records');
    });
  });

  module('splice', function() {
    test('it gets the type of filter to set', function(assert) {
      let filterType1 = getFilterTypeToSet('after');
      let filterType2 = getFilterTypeToSet('before');
      let filterType3 = getFilterTypeToSet('first');
      let filterType4 = getFilterTypeToSet('last');
      let filterType5 = getFilterTypeToSet('other');
      let otherType = 'filters';
      let relayType = 'relayFilters';

      assert.equal(filterType1, relayType, '"after" is a relay filter');
      assert.equal(filterType2, relayType, '"before" is a relay filter');
      assert.equal(filterType3, relayType, '"first" is a relay filter');
      assert.equal(filterType4, relayType, '"last" is a relay filter');
      assert.equal(filterType5, otherType, '"other" is not a relay filter');
    });

    test('it splices relay filters', function(assert) {
      let filters = [
        { resolvedName: 'other' },
        { resolvedName: 'first' }
      ];
      let getFilterTypeToSet = (name) =>
        name === 'first' ? 'relayFilters' : 'filters';
      let spliceRelayFilters = composeSpliceRelayFilters(getFilterTypeToSet);
      let filterTypes = spliceRelayFilters(filters);

      assert.deepEqual(filterTypes, {
        filters: [filters[0]],
        relayFilters: [filters[1]]
      }, 'It spliced the filters');
    });
  });
});
