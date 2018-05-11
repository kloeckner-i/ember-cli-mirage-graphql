import {
  filterRecordsByMappedField,
  filterRecordsByVars
} from '../filter-records';
import { getIsList, getTableByType, getTypeFromMeta } from '../utils';
import { getRelatedRecords } from '../related-records';

const mockQueryFn = (db, options = {}) => (root, vars, _, meta) => {
  let isList = getIsList(meta);
  let type = getTypeFromMeta(meta, isList);
  let { name: typeName } = type;
  let { recordType, records } = getTableByType(db, type);
  let { fieldsMap = {}, varsMap = {} } = options;

  records = filterRecordsByVars(records, vars, varsMap[typeName]);
  records = getRelatedRecords(records, recordType, type._fields,
    fieldsMap[typeName], db);
  records = filterRecordsByMappedField(records, meta.fieldName, fieldsMap);

  return isList ? records : records[0];
};

export default mockQueryFn;
