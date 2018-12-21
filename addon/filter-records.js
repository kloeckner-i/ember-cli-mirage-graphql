import Filter from './models/filter';
import { get } from '@ember/object';
import { getFieldName } from './fields/field-utils';
import {
  getIsRelayConnection,
  getIsRelayNode,
  handleRelayConnection,
  handleRelayNode
} from './relay-pagination';
import { isFunction } from './utils';

const sortFilters = ({ hasFnValue }) => hasFnValue ? 1 : -1;

const createFilters = (args = [], vars = {}, type, { varsMap = {} }) =>
  args.map(mapArgToFilter(vars, varsMap[type.name])).sort(sortFilters);

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

function createParentRecordFilter(filters, parent, isRelayNode) {
  let descendant = get(parent, 'parent.parent');

  parent = isRelayNode && descendant ? descendant : parent;

  let filter = Filter.create({
    hasFnValue: true,
    fn: (records) => records.filter(filterByParentRecord(parent))
  });

  filters.push(filter);
}

function filterReducer(records, filter) {
  let { fn, hasFnValue, key, mappedKey, value } = filter;

  if (hasFnValue || value != null) {
    return hasFnValue
      ? fn(records, key, value)
      : filterBy(records, mappedKey, value);
  }

  return records;
}

export function applyFilters(records = [], filters, reducerFn) {
  if (!records.length) return [{}];

  return filters.reduce(reducerFn, records);
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
