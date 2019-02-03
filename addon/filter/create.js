import Filter from './model';
import sortFilters from './sort';
import { isFunction } from '../utils';
import { set, setProperties } from '@ember/object';
import { spliceRelayFilters } from '../relay/filters';

const createFiltersByArgs = (args, vars, varsMap) =>
  args.map(getArgsToFiltersMapper(vars, varsMap)).sort(sortFilters);

const getArgsToFiltersMapper = (vars, varsMapForType = {}) =>
  ({ kind, name, value }) => {
    let filter = Filter.create({ name, value });

    if (kind === 'Variable') {
      let resolvedName = name in varsMapForType ? varsMapForType[name] : name;

      filter.set('value', vars[name]);

      isFunction(resolvedName)
        ? setProperties(filter, { hasFnValue: true, fn: resolvedName })
        : set(filter, 'resolvedName', resolvedName);
    }

    return filter;
  };

// TODO: Compose this function
export default function createFilters(field, vars, { varsMap = {} } = {}) {
  let { args, type } = field;
  let varsMapForType = varsMap[type.name];
  let filters = createFiltersByArgs(args, vars, varsMapForType);

  if (field.isRelayEdges) {
    let { filters: _filters, relayFilters } = spliceRelayFilters(filters);

    filters = _filters;
    // TODO: We're changing state here
    field.relayFilters = relayFilters;
  }

  return filters;
}
