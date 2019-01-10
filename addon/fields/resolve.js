import { get } from '@ember/object';
import { getFieldName, getRecordInfo, getTypeForField } from './field-utils';
import { getIsRelayConnectionField, resolveRelayConnectionField } from
  '../relay/connection';
import { isFunction } from '../utils';
import { normalizeSelections } from './selections';

const getMappedFieldName = (field, mappedField) =>
  (!isFunction(mappedField) && field !== mappedField) ? mappedField : null;

const fieldsReducer = (record, typeInfo, getAllRecordsByType, getRecords,
  parent, fieldName) =>
    (recordCopy, { field, mappedField, selection }) => {
      if (record[mappedField]) {
        recordCopy[field] = record[mappedField];
      } else if (selection && selection.selectionSet) {
        recordCopy[field] = getIsRelayConnectionField(field, typeInfo.meta)
          ? resolveRelayConnectionField({
              field,
              getAllRecordsByType,
              selectionSet: selection.selectionSet,
              typeInfo
            })
          : resolveRelatedField({
              field,
              fieldName,
              getRecords,
              mappedField,
              parent,
              record,
              selection,
              typeInfo
            });
      }

      return recordCopy;
    };

const mapRecordBySelectedFields = (fields, typeInfo, getAllRecordsByType,
  getRecords, parent, fieldName) =>
    (record) =>
      fields.reduce(fieldsReducer(record, typeInfo, getAllRecordsByType,
        getRecords, parent, fieldName), {});

function resolveRelatedField(options) {
  let {
    field,
    fieldName,
    getRecords,
    mappedField,
    parent,
    record,
    selection,
    typeInfo
  } = options;
  let { meta, type } = typeInfo;
  let mappedFieldName = getMappedFieldName(field, mappedField);
  let recordInfo = getRecordInfo(record, type, fieldName, parent, meta);
  let typeForField = getTypeForField(field, type);

  return getRecords(selection, typeForField, getRecords,
    recordInfo, mappedFieldName);
}

export const resolveFieldsForRecords = (getAllRecordsByType, options) =>
  ([fieldNode, typeInfo, records, getRecords, parent]) => {
    let selectedFields = get(fieldNode, 'selectionSet.selections');
    let { type } = typeInfo;
    let selections = normalizeSelections(selectedFields, type, options);
    let fieldName = getFieldName(fieldNode);

    records = records.map(mapRecordBySelectedFields(selections, typeInfo,
      getAllRecordsByType, getRecords, parent, fieldName));

    return [fieldNode, typeInfo, records, parent];
  };
