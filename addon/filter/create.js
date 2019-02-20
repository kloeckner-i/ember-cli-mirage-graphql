import Filter from './model';
import sortFilters from './sort';
import { isFunction, partial } from '../utils';
import { resolveVarName } from './vars';
import { set, setProperties } from '@ember/object';
import { spliceRelayFilters } from '../relay/filters';

export const composeMapArgsToFilters = (resolveVarName) =>
  (vars, varsMapForType = {}, { kind, name, value }) => {
    let filter = Filter.create({ name, value });

    if (kind === 'Variable') {
      let resolvedName = resolveVarName(name, varsMapForType);

      filter.set('value', vars[name]);

      isFunction(resolvedName)
        ? setProperties(filter, { hasFnValue: true, fn: resolvedName })
        : set(filter, 'resolvedName', resolvedName);
    }

    return filter;
  };

const mapArgsToFilters = composeMapArgsToFilters(resolveVarName);

const createFiltersByArgs = (args, vars, varsMap) =>
  args.map(partial(mapArgsToFilters, vars, varsMap));

export const composeCreateFilters =
  (createFiltersByArgs, sortFilters, spliceRelayFilters) =>
    (field, vars, { varsMap = {} } = {}) => {
      let { args, type } = field;
      let varsMapForType = varsMap[type.name];
      let filters = createFiltersByArgs(args, vars, varsMapForType)
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
