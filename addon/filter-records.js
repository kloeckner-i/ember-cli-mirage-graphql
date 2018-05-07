import { get } from '@ember/object';

export function filterRecordsByVars(db, type, vars, varsMap) {
  let records = db[type];

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

const isFunction = (obj) => typeof obj === 'function';

const filterBy = (records, key, value) => records.filter((record) =>
  get(record, key) === value);
