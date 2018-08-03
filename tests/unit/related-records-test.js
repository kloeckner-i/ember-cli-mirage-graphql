// import MockInfo from 'ember-cli-mirage-graphql/mock/info';
// import { createListReturnType } from '../helpers/return-type';
// import { getRelatedRecords } from 'ember-cli-mirage-graphql/related-records';
// import { module, test } from 'qunit';
//
// module('Unit | related records', function() {
//   let foos = [{ id: 1, foo: 'bar' }, { id: 2, foo: 'baz' }];
//   let bars = [
//     { id: 1, bar: 'foo', foo: foos[0] },
//     { id: 2, bar: 'baz', foo: foos[1] }
//   ];
//   let db = { foos, bars };
//
//   test('it can get related records', function(assert) {
//     let getRelatedRecordsFn = getRelatedRecords(db);
//     let returnType = createListReturnType('Foo', 'Bar');
//     let mockInfo = MockInfo.create({ records: db.foos, returnType });
//     let actualBars = getRelatedRecordsFn(mockInfo).records
//       .map((r) => r.bars[0]);
//
//     assert.deepEqual(actualBars, bars);
//   });
//
//   test('it can get related records by mapped field', function(assert) {
//     let options = { fieldsMap: { Foo: { bazs: 'bars' } } };
//     let getRelatedRecordsFn = getRelatedRecords(db, options);
//     let returnType = createListReturnType('Foo', 'Baz');
//     let mockInfo = MockInfo.create({ records: db.foos, returnType });
//     let actualBars = getRelatedRecordsFn(mockInfo).records
//       .map((r) => r.bazs[0]);
//
//     assert.deepEqual(actualBars, bars);
//   });
// });
