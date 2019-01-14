import { getArgsForField } from '../args';
import { getSelectedFields } from '../selections';

export function createFieldInfo(field, type, getType) {
  let args = getArgsForField(field);
  let typeInfo = getType(field, type);
  let fields = getSelectedFields(field, typeInfo.type, getType);
  let fieldInfo = { args, fields, typeInfo };

  return fieldInfo;
}
