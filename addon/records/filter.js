import Filter from '../filter/model';
import { applyRelayFilters, spliceRelayFilters } from '../relay/filters';
import { camelize } from 'ember-cli-mirage/utils/inflector'
import { ensureList, isFunction } from '../utils';
import { get } from '@ember/object';

/*
  TODO

   * Figure out why line items aren't filtering correctly for orders
 */

function createFilters(field, vars, { varsMap } = {}) {
  let { args, type } = field;
  let varsMapForType = varsMap[type.name];
  let filters = createFiltersByArgs(args, vars, varsMapForType);
  let relayFilters;

  if (field.isRelayEdges) {
    ({ filters, relayFilters } = spliceRelayFilters(filters));

    field.relayFilters = relayFilters;
  }

  return filters;
}

const createFiltersByArgs = (args, vars, varsMap) =>
  args.map(getArgsToFiltersMapper(vars, varsMap)).sort(sortFilters);

const filterBy = (records, key, value) =>
  records.filter((record) => get(record, key) === value);

function filterByParent(records, field, fieldName) {
  let [parentFieldName, parent] = getParentInfo(field.parent,
    field.isRelayEdges);

  return parent[fieldName]
    ? ensureList(parent[fieldName])
    : records.filter(getParentRecordFilter(parentFieldName));
}

const getArgsToFiltersMapper = (vars, varsMapForType = {}) =>
  ({ kind, name, value }) => {
    let filter = Filter.create({ name, resolvedName: name, value });

    if (kind === 'Variable') {
      let resolvedName = name in varsMapForType ? varsMapForType[name] : name;

      filter.set('value', vars[name]);

      isFunction(resolvedName)
        ? filter.setProperties({ hasFnValue: true, fn: resolvedName })
        : filter.set('resolvedName', resolvedName);
    }

    return filter;
  };

function getParentInfo(parent, isRelayEdges) {
  let parentFieldName = parent.field.type.name;
  let parentRecord = parent.record;

  if (isRelayEdges) {
    parentFieldName = parent.field.parent.field.type.name;
    parentRecord = parent.field.parent.record;
  }

  return [camelize(parentFieldName), parentRecord];
}

const getParentRecordFilter = (parentFieldName) =>
  (record) => get(record, `${parentFieldName}.id`) === record.id

function reduceRecordsByFilter(records, filter) {
  let { fn, hasFnValue, name, resolvedName, value } = filter;

  if (hasFnValue || value != null) {
    return hasFnValue
      ? fn(records, name, value)
      : filterBy(records, resolvedName, value);
  }

  return records;
}

function resolveFieldName(fieldName, type, { fieldsMap = {} } = {}) {
  let fieldsMapForType = fieldsMap[type.name] || {};
  let mappedFieldName = fieldsMapForType[fieldName];

  return mappedFieldName || fieldName;
}

const sortFilters = ({ hasFnValue }) => hasFnValue ? 1 : -1;

export function filterRecords(records, field, fieldName, vars, options) {
  if (!records.length) return records;

  let filters = createFilters(field, vars, options);
  let resolvedFieldName = resolveFieldName(fieldName, field.type, options);

  if (field.parent) records = filterByParent(records, field, resolvedFieldName);

  records = filters.reduce(reduceRecordsByFilter, records);

  if (field.relayFilters) records = applyRelayFilters(records, field);

  return records;
}
