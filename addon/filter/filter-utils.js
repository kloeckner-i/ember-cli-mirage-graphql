import Filter from './filter';
import { get } from '@ember/object';
import { isFunction } from '../utils';

const filterBy = (records, key, value) =>
  records.filter((record) => get(record, key) === value);

export const filterReducer = (records, filter) => {
  let { fn, hasFnValue, key, mappedKey, value } = filter;

  if (hasFnValue || value != null) {
    return hasFnValue
      ? fn(records, key, value)
      : filterBy(records, mappedKey, value);
  }

  return records;
}

export const mapArgToFilter = (vars, varsMapForType = {}) => ({ name, value }) => {
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

export const sortFilters = ({ hasFnValue }) => hasFnValue ? 1 : -1;
