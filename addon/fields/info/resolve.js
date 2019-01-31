import { contextSet, pipeWithMeta, reduceKeys } from '../../utils';
import { createRelayEdges } from '../../relay/edges';
import { getMapperForRecordFields } from '../../fields/map';
import { getRecordsInField, getRecordsByMappedFieldFn } from '../records';

const resolveReturnValue = (records, { field }) =>
  field.isList
    ? records
    : records instanceof Array
      ? records[0]
      : records;

const getResolveFieldsReducer = (fieldInfo, db, vars, options) =>
  (resolvedFields, fieldName) => {
    let field = fieldInfo[fieldName];
    let meta = { field, fieldName, db, vars, options };
    let records = recordsPipeline(null, meta);

    return contextSet(resolvedFields, fieldName, records);
  };

export const resolveFieldInfo = (fieldInfo, db, vars, options) =>
  reduceKeys(fieldInfo,
    getResolveFieldsReducer(fieldInfo, db, vars, options), {});

const mapFieldsForRecords = getMapperForRecordFields(resolveFieldInfo);

const recordsPipeline = pipeWithMeta(
  getRecordsInField,
  createRelayEdges,
  mapFieldsForRecords,
  getRecordsByMappedFieldFn,
  resolveReturnValue
);
