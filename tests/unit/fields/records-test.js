import {
  getRecordsByMappedFieldFnGetter
} from 'ember-cli-mirage-graphql/fields/records';
import { module, skip } from 'qunit';

module('Unit | Fields | records', function() {
 module('mapped field functions', function() {
   skip('it gets records for fields mapped to functions', function(assert) {
     let field = {};
     let fieldName = 'foo';
     let record = {};
     let getFieldsMap = () => ({ [fieldName]: () => record });
     let getParent = () => {};
     let getRecords = getRecordsByMappedFieldFnGetter(getFieldsMap, getParent);
     let records = getRecords(null, { field, fieldName });

     assert.equal(records, record, 'It returned result of mapped function');
   });

   skip('it returns records if no mapping', function(assert) {
     let field = {};
     let record = {};
     let getFieldsMap = () => null;
     let getRecords = getRecordsByMappedFieldFnGetter(getFieldsMap);
     let records = getRecords(record, { field });

     assert.equal(records, record, 'It returned records as-is');
   });

   skip('it returns records if mapped field not a function', function(assert) {
     let field = {};
     let fieldName = 'foo';
     let record = {};
     let getFieldsMap = () => ({ [fieldName]: fieldName });
     let getRecords = getRecordsByMappedFieldFnGetter(getFieldsMap);
     let records = getRecords(record, { field, fieldName });

      assert.equal(records, record, 'It returned records as-is');
   });
 });
});
