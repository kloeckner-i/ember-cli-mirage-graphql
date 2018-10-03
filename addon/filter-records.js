import Filter from './models/filter';
import { get } from '@ember/object';
import { getIsRelayConnection, parseRelayConnection } from './relay-pagination';
import { isFunction } from './utils';

const createFilters = (args = [], vars = {}, type, { varsMap = {} }) =>
  args.map(mapArgToFilter(vars, varsMap[type.name])).sort(({ value }) =>
    isFunction(value) ? 1 : -1);

const filterBy = (records, key, value) =>
  records.filter((record) => get(record, key) === value);

const filterByParentRecord = (parent) => (record) =>
  parent.name in record && record[parent.name].id === parent.record.id;

const mapArgToFilter = (vars, varsMapForType = {}) => ({ name, value }) => {
  let key = name.value;
  let filter = Filter.create({ key, mappedKey: key, value });

  if (value.kind === 'Variable') {
    let mappedKey = key in varsMapForType ? varsMapForType[key] : key;

    filter.set('value', vars[get(value, 'name.value')]);

    isFunction(mappedKey)
      ? filter.setProperties({ hasFnValue: true, fn: mappedKey })
      : filter.set('mappedKey', mappedKey);
  }

  return filter;
};

function applyFilters(records = [], filters) {
  if (!records.length) return [{}];

  filters.forEach((filter) => {
    if (filter.hasFnValue || filter.value != null) {
      records = filter.hasFnValue
        ? filter.fn(records, filter.key, filter.value)
        : filterBy(records, filter.mappedKey, filter.value);
    }
  });

  return records;
}

function createParentRecordFilter(filters, parent) {
  let filter = Filter.create({
    hasFnValue: true,
    fn: (records) => records.filter(filterByParentRecord(parent))
  });

  filters.push(filter);
}

export const filterRecords = (db, vars, options = {}) =>
  ([fieldNode, typeInfo, records, getRecords, parent]) => {
    let args = get(fieldNode, 'arguments');
    let { type } = typeInfo;
    let isRelayConnection = getIsRelayConnection(type, fieldNode);

    if (isRelayConnection) {
      ({ args } = parseRelayConnection(typeInfo, args));
    }

    let filters = createFilters(args, vars, type, options);

    if (parent) {
      createParentRecordFilter(filters, parent);
    }

    records = applyFilters(records, filters);

    return [fieldNode, typeInfo, records, getRecords, parent];
  };

// export const filterRecordsByVars = (vars, { varsMap = {} } = {}) =>
//   (mockInfo) => {
//     let { hasRelay, records, type } = mockInfo;
//     let relayVars;
//
//     if (hasRelay) {
//       ({ relayVars, vars } = abstractRelayVars(vars));
//     }
//
//     // NOTE: To do this with the vars map we need the notion of the concrete
//     // type here
//     records = filterRecords(records, vars, varsMap[type.name]);
//
//     if (hasRelay) {
//       records = filterByRelayVars(records, relayVars);
//     }
//
//     mockInfo.setRecords(records);
//
//     return mockInfo;
//   };
