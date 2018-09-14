import MockInfo from './mock/info';
import { get } from '@ember/object';

export const isFunction = (obj) => obj != null && typeof obj === 'function';

export const maybeUnwrapInterfaceType = (fieldNodes = [], { _typeMap }) =>
  (mockInfo) => {
    let [node] = fieldNodes;

    if (node) {
      let { selections = [] } = node.selectionSet;
      let selection = selections.find((s) => s.typeCondition) || {};
      let typeName = get(selection, 'typeCondition.name.value');

      if (typeName) {
        return MockInfo.create({ returnType: _typeMap[typeName] });
      }
    }

    return mockInfo;
  };

export const pipe = (...fns) => fns.reduce(pipeReducer);

export function contextSet(obj, k, v) {
  obj[k] = v;

  return obj;
}

const pipeReducer = (f, g) => (...args) => g(f(...args));
