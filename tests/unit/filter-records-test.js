import MockInfo from 'ember-cli-mirage-graphql/mock/info';
import { filterRecordsByVars, maybeFilterRecordsByMappedField } from
  'ember-cli-mirage-graphql/filter-records';
import { module, test } from 'qunit';

module('Unit | filter records', function() {
  let records = [{
    name: 'foo',
    type: 'a'
  }, {
    name: 'bar',
    type: 'a'
  }, {
    name: 'baz',
    type: 'b'
  }];

  test('it returns all records when no vars', function(assert) {
    let vars = {};
    let filterFn = filterRecordsByVars(vars);
    let returnType = { name: 'Foo' };
    let mockInfo = MockInfo.create({ records, returnType });

    assert.equal(filterFn(mockInfo).records, records);
  });

  test('it can filter records by vars', function(assert) {
    let vars = { type: 'a' };
    let filterFn = filterRecordsByVars(vars);
    let returnType = { name: 'Foo' };
    let mockInfo = MockInfo.create({ records, returnType });
    let expectedRecords = records.filter((r) => r.type === 'a');

    assert.deepEqual(filterFn(mockInfo).records, expectedRecords);
  });

  test('it can filter records by mapped vars', function(assert) {
    let vars = { kind: 'a' };
    let options = { varsMap: { Foo: { kind: 'type' } } };
    let filterFn = filterRecordsByVars(vars, options);
    let returnType = { name: 'Foo' };
    let mockInfo = MockInfo.create({ records, returnType });
    let expectedRecords = records.filter((r) => r.type === 'a');

    assert.deepEqual(filterFn(mockInfo).records, expectedRecords);
  });

  test('it can filter records by mapped field function', function(assert) {
    let fieldName = 'foo';
    let options = {
      fieldsMap: {
        [fieldName]: (records) => records.slice(0, 1)
      }
    };
    let filterFn = maybeFilterRecordsByMappedField(fieldName, options);
    let returnType = { name: 'Foo' };
    let mockInfo = MockInfo.create({ records, returnType });

    assert.deepEqual(filterFn(mockInfo).records, [records[0]]);
  });
});
