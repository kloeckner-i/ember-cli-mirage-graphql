import { abstractRelayVars, filterByRelayVars } from './relay-pagination';
import { get } from '@ember/object';
import { isFunction } from './utils';

export const filterRecordsByVars = (vars, { varsMap = {} } = {}) =>
  (mockInfo) => {
    let { hasRelay, records, type } = mockInfo;
    let relayVars;

    if (hasRelay) {
      ({ relayVars, vars } = abstractRelayVars(vars));
    }

    records = filterRecords(records, vars, varsMap[type.name]);

    if (hasRelay) {
      records = filterByRelayVars(records, relayVars);
    }

    mockInfo.setRecords(records);

    return mockInfo;
  };

export const maybeFilterRecordsByMappedField = (fieldName, options = {}) =>
  (mockInfo) => {
    let { fieldsMap = {} } = options;
    let { records } = mockInfo;

    if (isFunction(fieldsMap[fieldName])) {
      records = fieldsMap[fieldName](records);
    }

    mockInfo.setRecords(records);

    return mockInfo;
  };

const filterBy = (records, key, value) =>
  records.filter((record) => get(record, key) === value);

const mapVariables = (vars, varsMap) =>
  (key) => [key in varsMap ? varsMap[key] : key, key, vars[key]];

const sortMappedVariables = ([key]) => isFunction(key) ? 1 : -1;

function filterRecords(records, vars, varsMap = {}) {
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
