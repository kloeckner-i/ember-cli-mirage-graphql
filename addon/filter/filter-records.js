import Filter from './filter';
import { get } from '@ember/object';
import { getFieldName } from '../fields/field-utils';
import { getIsRelayConnection, handleRelayConnection } from
  '../relay/connection';
import { getIsRelayNode, handleRelayNode } from '../relay/node';
import { filterReducer, mapArgToFilter, sortFilters } from './filter-utils';

function applyFilters(records = [], filters, reducerFn) {
  // TODO: Does this make sense?
  if (!records.length) return [{}];

  return filters.reduce(reducerFn, records);
}

const createFilters = (args = [], vars = {}, type, { varsMap = {} }) =>
  args.map(mapArgToFilter(vars, varsMap[type.name])).sort(sortFilters);

const filterByParentRecord = (parent) => (record) =>
  parent.name in record && record[parent.name].id === parent.record.id;

function createParentRecordFilter(filters, parent, isRelayNode) {
  let descendant = get(parent, 'parent.parent');

  parent = isRelayNode && descendant ? descendant : parent;

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
    let isRelayNode = getIsRelayNode(getFieldName(fieldNode), parent);

    if (isRelayConnection) {
      ({ filters = [] } = handleRelayConnection(typeInfo, filters));
    }

    if (parent) {
      createParentRecordFilter(filters, parent, isRelayNode);
    }

    records = applyFilters(records, filters, filterReducer);

    if (isRelayNode) {
      handleRelayNode(records, parent, type.name);
    }

    return [fieldNode, typeInfo, records, getRecords, parent];
  };
