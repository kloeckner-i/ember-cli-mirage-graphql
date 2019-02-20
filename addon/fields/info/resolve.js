import filterRecords from '../../filter/records';
import filterRecordsByMappedField from '../../filter/records/mapped-field';
import mapFieldsForRecords from '../../fields/map/records';
import { contextSet, pipeWithMeta, reduceKeys } from '../../utils';
import { createRelayEdges } from '../../relay/edges';
import { getRecordsByField } from '../records';

const resolveReturnValue = (records, { field }) =>
  field.isList
    ? records
    : records instanceof Array
      ? records[0]
      : records;

const composeFieldInfoReducer = (fieldInfo, db, vars, options, recordsPipeline) =>
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

export const composeResolveFieldInfo = (recordsPipeline) =>
  (fieldInfo, db, vars, options) =>
    reduceKeys(fieldInfo,
      composeFieldInfoReducer(fieldInfo, db, vars, options, recordsPipeline), {});

const resolveFieldInfo = composeResolveFieldInfo(recordsPipeline);

export default resolveFieldInfo;
