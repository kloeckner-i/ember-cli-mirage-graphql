import resolveFieldValue from '../value';
import { getIsRelayNodeField } from '../../relay/node';
import { partial, reduceKeys } from '../../utils';

export const composeFieldsReducer = (getIsRelayNodeField, resolveFieldValue) =>
  (record, meta, mappedRecord, fieldName) => {
    let { field } = meta;
    let fieldValue = field.fields[fieldName];

    if (fieldValue) {
      fieldValue.parent = { field, record };
    }

    if (getIsRelayNodeField(fieldName, field)) {
      fieldValue.relayNode = record.node;
    }

    mappedRecord[fieldName] =
      resolveFieldValue(record, fieldName, fieldValue, meta);

    return mappedRecord;
  };

const fieldsReducer =
  composeFieldsReducer(getIsRelayNodeField, resolveFieldValue);

export const composeMapFieldsForRecords = (fieldsReducer) =>
  (records, meta) =>
    records.map((record) =>
      reduceKeys(meta.field.fields, partial(fieldsReducer, record, meta), {}));

const mapFieldsForRecords = composeMapFieldsForRecords(fieldsReducer);

export default mapFieldsForRecords;
