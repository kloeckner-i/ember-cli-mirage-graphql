import { createFieldInfo } from '../fields/info/create';
import { resolveFieldInfo } from '../fields/info/resolve';
import { getFieldName } from '../fields/name';
import { getTypeForField } from '../fields/type';
import { partial } from '../utils';

const mockQueryFn = (db, options) =>
  (_, vars, __, { fieldNodes, returnType, schema }) => {
    let getType = partial(getTypeForField, schema._typeMap);
    let [rootField] = fieldNodes;
    let rootFieldName = getFieldName(rootField);
    let rootFieldInfo = {
      [rootFieldName]: createFieldInfo(rootField, returnType, getType)
    };
    let records = resolveFieldInfo(rootFieldInfo, db, vars, options);

    return records;
  };

export default mockQueryFn;
