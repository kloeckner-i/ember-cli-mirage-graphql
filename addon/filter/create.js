import Filter from './model';
import sortFilters from './sort';
import { isFunction, partial } from '../utils';
import { resolveArgName } from '../fields/args';
import { set, setProperties } from '@ember/object';
import { spliceRelayFilters } from '../relay/filters';

export const composeMapArgsToFilters = (resolveArgName) =>
  (vars, argsMapForType = {}, { kind, name, value, variableName }) => {
    let filter = Filter.create({ name, value });
    let resolvedName = resolveArgName(name, argsMapForType);

    isFunction(resolvedName)
      ? setProperties(filter, { hasFnValue: true, fn: resolvedName })
      : set(filter, 'resolvedName', resolvedName);

    if (kind === 'Variable') {
      filter.set('value', vars[variableName]);
    }
    if (kind === 'ObjectValue') {
      filter.set('value', vars);
    }

    return filter;
  };

const mapArgsToFilters = composeMapArgsToFilters(resolveArgName);

const createFiltersByArgs = (args, vars, argsMap) =>
  args.map(partial(mapArgsToFilters, vars, argsMap));

export const composeCreateFilters =
  (createFiltersByArgs, sortFilters, spliceRelayFilters) =>
    (field, vars, { argsMap = {} } = {}) => {
      let { args, type } = field;
      let argsMapForType = argsMap[type.name];
      let filters = createFiltersByArgs(args, vars, argsMapForType)
        .sort(sortFilters);

      if (field.isRelayEdges) {
        let { filters: _filters, relayFilters } = spliceRelayFilters(filters);

        filters = _filters;

        field.relayFilters = relayFilters;
      }

      return filters;
    };

const createFilters =
  composeCreateFilters(createFiltersByArgs, sortFilters, spliceRelayFilters);

export default createFilters;
