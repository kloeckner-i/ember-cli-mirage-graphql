import { contextSet, pipeWithMeta, reduceKeys } from '../../utils';
import { createRelayEdges } from '../../relay/edges';
import { getRecordsInField, getRecordsByMappedFieldFn } from '../records';
import { mapFieldsForRecords } from '../../fields/map';

const unwrapList = (records, { field }) => field.isList ? records : records[0];

const recordsPipeline = pipeWithMeta(
  getRecordsInField,
  createRelayEdges,
  mapFieldsForRecords,
  getRecordsByMappedFieldFn,
  unwrapList
);

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
