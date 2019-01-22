import { createRelayEdges } from '../../relay/edges';
import { filterRecords } from '../../records/filter';
import { getAllRecordsByType, getRecordsByMappedFieldFn } from
  '../../records/get';
import { mapFieldsForRecords } from '../../fields/map';

/*
  TODO

  * Clean it all up by piping the records through
 */
const getResolveFieldsReducer = (fieldInfo, db, vars, options) =>
  (resolvedFields, fieldName) => {
    let field = fieldInfo[fieldName];
    let records;

    if (field.relayNode) {
      records = [field.relayNode];
    } else if (field.relayPageInfo) {
      records = [field.relayPageInfo];
    } else {
      records = getAllRecordsByType(fieldName, field, db, options);
      records = filterRecords(records, field, fieldName, vars, options);
    }

    if (field.isRelayEdges) {
      records = createRelayEdges(records,
        field.fields.node.type.name);
    }

    records = mapFieldsForRecords(records, field, db, vars, options);
    records = getRecordsByMappedFieldFn(records, field, fieldName, db,
      options);
    records = field.isList ? records : records[0];

    resolvedFields[fieldName] = records;

    // if (field.type._interfaces.length) {
    //   if (!options.interfaceMocks) {
    //     options.interfaceMocks = {};
    //   }
    //
    //   field.type._interfaces.forEach(({ name }) => {
    //     if (!options.interfaceMocks[name]) {
    //       options.interfaceMocks[name] = {};
    //     }
    //
    //     options.interfaceMocks[name][field.type.name.toLowerCase()] = records;
    //
    //     options.interfaceMocks[name].fn = function(key) {
    //       debugger;
    //       return this[key];
    //     }
    //   });
    // }

    return resolvedFields;
  };

export const resolveFieldInfo = (fieldInfo, db, vars, options, meta) =>
  Object.keys(fieldInfo)
    .reduce(getResolveFieldsReducer(fieldInfo, db, vars, options, meta), {});
