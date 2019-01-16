// import { filterRecords } from '../../records/filter';
import { GraphQLList } from 'graphql';
import { createRelayEdges } from '../../relay/edges';
import { getAllRecordsByType} from '../../records/get';
import { mapFieldsForRecords } from '../../fields/map';

const resolveReturnType = (records, returnType) =>
  returnType instanceof GraphQLList
    ? records
    : records[0];

const getResolveFieldsReducer = (fieldInfo, db, vars, options, meta = {}) =>
  (resolvedFields, fieldName) => {
    try {
      let field = fieldInfo[fieldName];
      let records = meta.relayNode
        ? [meta.relayNode]
        : getAllRecordsByType(fieldName, field, db, options, meta);

      if (meta.isRelayEdges) {
        records = createRelayEdges(records,
          field.fields.node.typeInfo.type.name);
      }

      /*
        TODO

        1. Filter records
           * Separate Relay vars and attach to meta
           * Dig up concrete type for edges
        2. Filter edges and store pageInfo, if Relay field
        3. Filter records by mapped field, if mapped field is function
        4. Map records by selected fields ( in progress)
        5. Clean it all up by piping the records through
       */
      // records = filterRecords(records, field.args, vars, options);
      // records = getRecordsByMappedFieldFn(records, db, meta.parent);

      records = mapFieldsForRecords(records, field, db, vars, options, meta);
      records = resolveReturnType(records, field.typeInfo.returnType);

      resolvedFields[fieldName] = records;

      return resolvedFields;
    } catch(ex) {
      debugger;
    }
  };

export const resolveFieldInfo = (fieldInfo, db, vars, options, meta) =>
  Object.keys(fieldInfo)
    .reduce(getResolveFieldsReducer(fieldInfo, db, vars, options, meta), {});
