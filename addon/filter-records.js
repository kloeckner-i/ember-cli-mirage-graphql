import Filter from './models/filter';
import { get } from '@ember/object';
import { isFunction } from './utils';

const createFilters = (args = [], vars = {}, type, { varsMap = {} }) =>
  args.map(mapArgToFilter(vars, varsMap[type.name])).sort(({ value }) =>
    isFunction(value) ? 1 : -1);

const filterBy = (records, key, value) =>
  records.filter((record) => get(record, key) === value);

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

function _filterRecords(records = [], filters) {
  if (!records.length) return [{}];

  filters.forEach(({ fn, hasFnValue, key, mappedKey, value }) => {
    if (hasFnValue || value != null) {
      records = hasFnValue
        ? fn(records, key, value)
        : filterBy(records, mappedKey, value);
    }
  });

  return records;
}

const createParentRecordFilter = (filters, parent) =>
  filters.push(Filter.create({
    fn: (records) => records.filter((record) => parent.type in record
      && record[parent.type].id === parent.record.id),
    hasFnValue: true
  }));

export const filterRecords = (db, vars, options = {}) =>
  ([fieldNode, typeInfo, records, getRecords, parent]) => {
    let args = get(fieldNode, 'arguments');
    let { type } = typeInfo;
    let filters = createFilters(args, vars, type, options);

    if (parent) {
      createParentRecordFilter(filters, parent);
    }

    return [fieldNode, typeInfo, _filterRecords(records, filters), getRecords];

    /*
      Maybe this should work like this:

      Try to fetch records from Mirage
      If records
        Filter records
        Map records, reducing fields to those in selection set
      End
      // Regardless of number of records
      For each record
        For each object or list type in selections
          Get records for field in record
        End
      End

      NOTE: This is where we should probably load records. This is because we
      want to determine if we have Relay Pagination here. If we do, we need to
      resolve the record type differently and wrap things up when we're done.

      Question: What do we do when there are no records for a type but there
      are for its fields? I.E., a connection type that has some arbitrary
      relationship field?

      Example:

      ProductConnection: {
        edges: [{ node: {} }],
        pageInfo: {},
        categories: []
      }

      Basically, we want to resolve data for fields, recursively, whether that
      field be scalar or related. To do this, we can start by looking for a
      Mirage table. If one exists, that will fill out the scalar fields and we
      can filter out any we don't want, later.

      If no Mirage table exists, we might assume all fields are either a
      relationship or a Relay Pagination field like edges, pageInfo, cursor or
      node.

      Since Relay Pagination implies a list, we can probably build the list
      of nodes without iterating over the field nodes for edges and pageInfo.

      NOTE: Maybe we can build up records for relay fields and then supply them
      in place of Mirage records? This might allow us to maintain the current
      flow where we map requested fields from records into record copies.
     */
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
