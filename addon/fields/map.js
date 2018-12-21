import { getFieldName } from './field-utils';
import { isFunction } from '../utils';

export const maybeMapFieldByFunction = (db, { fieldsMap = {} } = {}) =>
  ([fieldNode, typeInfo, records, parent]) => {
    let _fieldsMap = fieldsMap;
    let fieldName = getFieldName(fieldNode);

    if (parent) {
      _fieldsMap = fieldsMap[parent.type.name];
    }

    records = _fieldsMap && fieldName in _fieldsMap
      && isFunction(_fieldsMap[fieldName])
        ? _fieldsMap[fieldName](records, db, parent)
        : records;

    return [typeInfo, records];
  };
