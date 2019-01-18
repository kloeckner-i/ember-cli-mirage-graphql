import { createRelayEdges } from '../../relay/edges';
import { filterRecords } from '../../records/filter';
import { getAllRecordsByType} from '../../records/get';
import { mapFieldsForRecords } from '../../fields/map';

/*
  TODO

  1. Filter records
  2. Filter edges and store pageInfo, if Relay field
  3. Filter records by mapped field, if mapped field is function
  4. Map records by selected fields ( in progress)
  5. Clean it all up by piping the records through
 */
const getResolveFieldsReducer = (fieldInfo, db, vars, options) =>
  (resolvedFields, fieldName) => {
    try {
      let field = fieldInfo[fieldName];
      let records = field.relayNode
        ? [field.relayNode]
        : getAllRecordsByType(fieldName, field, db, options);

      records = filterRecords(records, field, fieldName, vars, options);

      if (field.isRelayEdges) {
        records = createRelayEdges(records,
          field.fields.node.type.name);
      }

      records = mapFieldsForRecords(records, field, db, vars, options);

      // records = getRecordsByMappedFieldFn(records, db, meta.parent);

      resolvedFields[fieldName] = field.isList ? records : records[0];

      return resolvedFields;
    } catch(ex) {
      debugger;
    }
  };

export const resolveFieldInfo = (fieldInfo, db, vars, options, meta) =>
  Object.keys(fieldInfo)
    .reduce(getResolveFieldsReducer(fieldInfo, db, vars, options, meta), {});
