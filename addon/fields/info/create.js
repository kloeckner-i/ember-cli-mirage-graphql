import FieldInfo from './model';
import { getArgsForField } from '../args';
import { getIsRelayConnection } from '../../relay/connection';
import { getSelectedFields } from '../selections';

export function createFieldInfo(field, type, getType) {
  let args = getArgsForField(field);
  let [isList, recordType] = getType(field, type);
  let fields = getSelectedFields(field, recordType, getType);

  if (getIsRelayConnection(recordType.name, Object.keys(fields))) {
    fields.edges.args = fields.edges.args.concat(args);
    fields.edges.isRelayEdges = true;

    args = [];
  }

  let fieldInfo = FieldInfo.create({ args, fields, isList, type: recordType });

  return fieldInfo;
}
