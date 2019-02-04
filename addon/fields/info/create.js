import FieldInfo from './model';
import { getArgsForField } from '../args';
import { getIsRelayConnection } from '../../relay/connection';
import { getSelectedFields } from '../selections';

const getFieldInfoGetter = (getArgsForField, getSelectedFields, getIsRelayConnection) =>
  (field, type, getType) => {
    let { isList, recordType } = getType(field, type);
    let args = getArgsForField(field);
    let fields = getSelectedFields(field, recordType, getType);
    let isRelayConnection = getIsRelayConnection(recordType.name,
      Object.keys(fields));

    return { args, fields, isList, isRelayConnection, recordType };
  }

const getFieldInfo = getFieldInfoGetter(getArgsForField, getSelectedFields,
  getIsRelayConnection);

export const getFieldInfoCreator = (getFieldInfo) =>
  (field, fieldName, type, getType) => {
    let { args, fields, isList, isRelayConnection, recordType } =
      getFieldInfo(field, type, getType);

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

const createFieldInfo = getFieldInfoCreator(getFieldInfo);

export default createFieldInfo;
