import resolveFieldName from './name/resolve';
import { isFunction } from '../utils';

export const composeResolveFieldValue = (resolveFieldName) =>
  (record, fieldName, fieldValue, meta) => {
    let { db, field, options, resolveFieldInfo, vars } = meta;
    let fieldInfo = { [fieldName]: fieldValue };
    let resolvedFieldName = resolveFieldName(fieldName, field.type.name, options);

    return fieldValue
      ? resolveFieldInfo(fieldInfo, db, vars, options)[fieldName]
      : fieldName === '__typename'
        ? field.type.name
        : record[!isFunction(resolvedFieldName) && resolvedFieldName || fieldName];
  };

const resolveFieldValue = composeResolveFieldValue(resolveFieldName);

export default resolveFieldValue;
