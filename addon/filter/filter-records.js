import Filter from './filter';
import { get } from '@ember/object';
import { getIsRelayConnection, handleRelayConnection } from
  '../relay/connection';
import { filterReducer, mapArgToFilter, sortFilters } from './filter-utils';

const applyFilters = (records = [], filters, reducerFn) =>
  records.length ? filters.reduce(reducerFn, records) : [];

const createFilters = (args = [], vars = {}, type, { varsMap = {} }) =>
  args.map(mapArgToFilter(vars, varsMap[type.name])).sort(sortFilters);

const filterByParentRecord = (parent) => (record) =>
  parent.name in record && record[parent.name].id === parent.record.id;

function createParentRecordFilter(filters, parent) {
  let filter = Filter.create({
    hasFnValue: true,
    fn: (records) => records.filter(filterByParentRecord(parent))
  });

  filters.push(filter);
}

export const filterRecords = (db, vars, options = {}) =>
  ([fieldNode, typeInfo, records, getRecords, parent]) => {
    let { type } = typeInfo;
    let args = get(fieldNode, 'arguments');
    let filters = createFilters(args, vars, type, options);
    let isRelayConnection = getIsRelayConnection(type, fieldNode);

    if (isRelayConnection) {
      ({ filters = [] } = handleRelayConnection(typeInfo, filters));
    }

    if (parent) {
      createParentRecordFilter(filters, parent);
    }

    records = applyFilters(records, filters, filterReducer);

    return [fieldNode, typeInfo, records, getRecords, parent];
  };
