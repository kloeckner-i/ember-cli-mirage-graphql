import { get } from '@ember/object';
import { getFieldName, getRecordInfo, getTypeForField } from './field-utils';
import { normalizeSelections } from './selections';

export const resolveField = (fields, typeInfo, getRecords, parent, fieldName) =>
  (record) => {
    let recordCopy = {};

    fields.forEach(({ field, mappedField, selection }) => {
      if (record[mappedField]) {
        return recordCopy[field] = record[mappedField];
      }

      if (selection && selection.selectionSet) {
        let mappedFieldName = field !== mappedField ? mappedField : null;
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

    records = records.map(resolveField(selections, typeInfo, getRecords,
      parent, fieldName));

    return [fieldNode, typeInfo, records, parent];
  };
