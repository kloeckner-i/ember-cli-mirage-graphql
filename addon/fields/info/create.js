import FieldInfo from './model';
import { getArgsForField } from '../args';
import { getIsRelayConnection } from '../../relay/connection';
import { getSelectedFields } from '../selections';

const composeGetFieldInfo = (getArgsForField, getSelectedFields, getIsRelayConnection) =>
  (field, type, fragments, getType) => {
    let { isList, recordType } = getType(field, type);
    let args = getArgsForField(field);
    let fields = getSelectedFields(field, recordType, fragments, getType);
    let isRelayConnection = recordType._fields &&
      getIsRelayConnection(recordType.name, Object.keys(recordType._fields));

    return { args, fields, isList, isRelayConnection, recordType };
  }

const getFieldInfo = composeGetFieldInfo(getArgsForField, getSelectedFields,
  getIsRelayConnection);

export const composeCreateFieldInfo = (getFieldInfo) =>
  (field, fieldName, type, fragments, getType) => {
    let { args, fields, isList, isRelayConnection, recordType } =
      getFieldInfo(field, type, fragments, getType);

    if (isRelayConnection) {
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
  };

const createFieldInfo = composeCreateFieldInfo(getFieldInfo);

export default createFieldInfo;
