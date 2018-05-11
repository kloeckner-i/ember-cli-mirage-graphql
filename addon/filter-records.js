import { get } from '@ember/object';
import { isFunction } from './utils';

export const filterRecordsByMappedField = (data, fieldName, fieldsMap) =>
  isFunction(fieldsMap[fieldName]) ? fieldsMap[fieldName](data) : data;

export function filterRecordsByVars(records, vars, varsMap) {
  Object.keys(vars)
    .map(mapVariables(vars, varsMap))
    .sort(sortMappedVariables)
    .forEach(([mappedKey, originalKey, value]) => {
      if (value != null) {
        records = isFunction(mappedKey)
          ? mappedKey(records, originalKey, value)
          : filterBy(records, mappedKey, value);
      }
    });

  return records;
}

const mapVariables = (vars, varsMap = {}) => (key) =>
  [key in varsMap ? varsMap[key] : key, key, vars[key]];

const sortMappedVariables = ([key]) => isFunction(key) ? 1 : -1;

const filterBy = (records, key, value) => records.filter((record) =>
  get(record, key) === value);
