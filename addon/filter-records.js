import { abstractRelayVars, filterByRelayVars } from './relay-pagination';
import { get } from '@ember/object';
import { isFunction } from './utils';

export const filterRecordsByVars = (vars, { varsMap = {} } = {}) =>
  (mockQueryInfo) => {
    let { hasRelay, records } = mockQueryInfo;
    let relayVars;

    if (hasRelay) {
      ({ relayVars, vars } = abstractRelayVars(vars));
    }

    records = filterRecords(records, vars, varsMap);

    if (hasRelay) {
      records = filterByRelayVars(records, relayVars);
    }

    mockQueryInfo.setRecords(records);

    return mockQueryInfo;
  };

export const maybeFilterRecordsByMappedField = (fieldName, options = {}) =>
  (mockQueryInfo) => {
    let { fieldsMap = {} } = options;
    let { records } = mockQueryInfo;

    if (isFunction(fieldsMap[fieldName])) {
      records = fieldsMap[fieldName](records);
    }

    mockQueryInfo.setRecords(records);

    return mockQueryInfo;
  };

const filterBy = (records, key, value) => records.filter((record) =>
  get(record, key) === value);

const mapVariables = (vars, varsMap = {}) => (key) =>
  [key in varsMap ? varsMap[key] : key, key, vars[key]];

const sortMappedVariables = ([key]) => isFunction(key) ? 1 : -1;

function filterRecords(records, vars, varsMap) {
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
