import FieldInfo from './model';
import { getArgsForField } from '../args';
import { getIsRelayConnection } from '../../relay/connection';
import { getSelectedFields } from '../selections';

export function createFieldInfo(field, fieldName, type, getType) {
  let args = getArgsForField(field);
  let { isList, recordType } = getType(field, type);
  let fields = getSelectedFields(field, recordType, getType);
  let isRelayConnection = false;

  if (getIsRelayConnection(recordType.name, Object.keys(fields))) {
    isRelayConnection = true;

    fields.edges.args = fields.edges.args.concat(args);
    fields.edges.isRelayEdges = true;

    args = [];
  }

  let fieldInfo = FieldInfo.create({
    args,
    fields,
    isList,
    isRelayConnection,
    type: recordType
  });

  return fieldInfo;
}
