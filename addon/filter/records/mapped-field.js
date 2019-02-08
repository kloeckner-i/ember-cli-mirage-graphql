import { getFieldsMapForType } from '../../fields/map/type';
import { getParentRecord } from '../../records';
import { isFunction } from '../../utils';

// TODO: Add unit test for this
export const composeFilterRecordsByMappedField =
  (getFieldsMapForType, getParentRecord) =>
    (records, meta) => {
      let { db, field, fieldName, options = {} } = meta;
      let { fieldsMap = {} } = options;
      let fieldsMapForType = getFieldsMapForType(field.parent, fieldsMap);
      let resolvedFieldName = fieldsMapForType && fieldsMapForType[fieldName];

      if (isFunction(resolvedFieldName)) {
        let parent = getParentRecord(field.parent);

        records = resolvedFieldName(records, db, parent);
      }

      return records;
    };

const filterRecordsByMappedField =
  composeFilterRecordsByMappedField(getFieldsMapForType, getParentRecord);

export default filterRecordsByMappedField;
