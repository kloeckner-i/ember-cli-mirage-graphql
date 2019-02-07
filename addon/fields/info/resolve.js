import filterRecords from '../../filter/records';
import filterRecordsByMappedField from '../../filter/records/mapped-field';
import mapFieldsForRecords from '../../fields/map';
import { contextSet, pipeWithMeta, reduceKeys } from '../../utils';
import { createRelayEdges } from '../../relay/edges';
import { getRecordsByField } from '../records';

const resolveReturnValue = (records, { field }) =>
  field.isList
    ? records
    : records instanceof Array
      ? records[0]
      : records;

const getFieldInfoReducer = (fieldInfo, db, vars, options, recordsPipeline) =>
  (resolvedFields, fieldName) => {
    let field = fieldInfo[fieldName];
    let meta = { db, field, fieldName, options, resolveFieldInfo, vars };
    let records = recordsPipeline(null, meta);

    return contextSet(resolvedFields, fieldName, records);
  };

const recordsPipeline = pipeWithMeta(
  getRecordsByField,
  filterRecords,
  createRelayEdges,
  mapFieldsForRecords,
  filterRecordsByMappedField,
  resolveReturnValue
);

export const getFieldInfoResolver = (recordsPipeline) =>
  (fieldInfo, db, vars, options) =>
    reduceKeys(fieldInfo,
      getFieldInfoReducer(fieldInfo, db, vars, options, recordsPipeline), {});

const resolveFieldInfo = getFieldInfoResolver(recordsPipeline);

export default resolveFieldInfo;
