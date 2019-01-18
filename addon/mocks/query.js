import { createFieldInfo } from '../fields/info/create';
import { resolveFieldInfo } from '../fields/info/resolve';
import { getFieldName } from '../fields/name';
import { getTypeForField } from '../fields/type';
import { partial } from '../utils';

const mockQueryFn = (db, options) =>
  (_, vars, __, { fieldNodes, returnType, schema }) => {
    let getType = partial(getTypeForField, schema._typeMap);
    let [rootField] = fieldNodes;
    let fieldName = getFieldName(rootField);
    let fieldInfo = {
      [fieldName]: createFieldInfo(rootField, returnType, getType)
    };
    let records = resolveFieldInfo(fieldInfo, db, vars, options);

    debugger;

    return records;
  };

export default mockQueryFn;
