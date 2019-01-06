import { get } from '@ember/object';
import { getFieldName, getRecordInfo, getTypeForField } from './field-utils';
import { getIsRelayConnectionField } from '../relay/connection';
import { isFunction } from '../utils';
import { normalizeSelections } from './selections';

const getMappedFieldName = (field, mappedField) =>
  (!isFunction(mappedField) && field !== mappedField) ? mappedField : null;

const mapRecord = (fields, typeInfo, getRecords, parent, fieldName) =>
  (record) => {
    let recordCopy = {};

    fields.forEach(({ field, mappedField, selection }) => {
      if (record[mappedField]) {
        return recordCopy[field] = record[mappedField];
      }

      if (selection && selection.selectionSet) {
        let mappedFieldName = getMappedFieldName(field, mappedField);
        let { meta, type } = typeInfo;
        let recordInfo = getRecordInfo(record, type, fieldName, parent, meta);
        let typeForField = getTypeForField(field, type);

        recordCopy[field] = getRecords(selection, typeForField, getRecords,
          recordInfo, mappedFieldName);
      }
    });

    return recordCopy;
  };

export const resolveFieldsForRecords = (options) =>
  ([fieldNode, typeInfo, records, getRecords, parent]) => {
    let selectedFields = get(fieldNode, 'selectionSet.selections');
    let { type } = typeInfo;
    let selections = normalizeSelections(selectedFields, type, options);
    let fieldName = getFieldName(fieldNode);

    records = records.map(mapRecord(selections, typeInfo, getRecords,
      parent, fieldName));

    if (getIsRelayConnectionField(fieldName, parent)) {
      records = parent.record[fieldName];
    }

    return [fieldNode, typeInfo, records, parent];
  };
