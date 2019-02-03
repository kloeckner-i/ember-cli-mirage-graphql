import FieldInfo from './model';
import { getArgsForField } from '../args';
import { getIsRelayConnection } from '../../relay/connection';
import { getSelectedFields } from '../selections';

// TODO: Compose this function
export function createFieldInfo(field, fieldName, type, getType) {
  let { isList, recordType } = getType(field, type);
  let args = getArgsForField(field);
  let fields = getSelectedFields(field, recordType, getType);
  let isRelayConnection = false;

  if (getIsRelayConnection(recordType.name, Object.keys(fields))) {
    isRelayConnection = true;

    // TODO: We're changing state here
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
