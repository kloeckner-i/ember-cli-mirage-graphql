import { composeFilterByParent, filterByParentField, getParentInfo } from
  'ember-cli-mirage-graphql/filter/parent';
import { module, skip, test } from 'qunit';

module('Unit | Filter | parent', function() {
  module('get info', function() {
    test('it gets the parent field name and record', function(assert) {
      let parent = { field: { type: { name: 'Foo-Bar' } }, record: {} };
      let [fieldName, record] = getParentInfo(parent);

      assert.equal(fieldName, 'fooBar', 'It got the field name');
      assert.equal(record, parent.record, 'It got the record');
    });

    test('it gets relay edges parent field name and record', function(assert) {
      let isRelayEdges = true;
      let grandParent = { field: { type: { name: 'bar' } }, record: {} };
      let parent = { field: { parent: grandParent, type: { name: 'Foo-Bar' } } };
      let [fieldName, record] = getParentInfo(parent, isRelayEdges);

      assert.equal(fieldName, grandParent.field.type.name, 'It got the field name');
      assert.equal(record, grandParent.record, 'It got the record');
    });
  });

  module('field', function() {
    test('it filters records by parent field', function(assert) {
      let parentFieldName = 'foo';
      let records = [
        { id: 1, [parentFieldName]: { id: 123 } },
        { id: 2, [parentFieldName]: { id: 321 } }
      ];
      let filteredRecords = filterByParentField(parentFieldName, 123, records);

      assert.deepEqual(filteredRecords, [records[0]], 'It filtered records');
    });
  });

  module('filter by', function() {
    skip('it returns records, if no parent', function(assert) {
      let filterByParent = composeFilterByParent();
      let records = [];
      let filteredRecords = filterByParent(records, { field: {} });

      assert.equal(filteredRecords, records, 'It returned the records');
    });

    skip('it filters records, if referenced by parent', function() {
    });

    skip('it filters records that reference parent', function(assert) {
      let fieldName = 'bar';
      let records = [{ foo: 'bar' }, { foo: 'baz' }];
      let filterByParentField = () => records[0];
      let getParentInfo = () => ({ id: 1, [fieldName]: 'foo' });
      let filterByParent = composeFilterByParent(getParentInfo, filterByParentField);
      let filteredRecords = filterByParent(records, { field: {}, fieldName });

      assert.deepEqual(filteredRecords, [records[0]], 'It returned the records');
    });
  });
});
