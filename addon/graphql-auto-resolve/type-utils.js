import {
  isInterfaceType,
  isListType,
  isNonNullType,
  isObjectType,
  isUnionType
} from 'graphql';

const POLYMORPHIC_TYPE_CHECKS = [isInterfaceType, isUnionType];
const RESOLVE_VIA_STRATEGY_TYPE_CHECKS = [
  isListType,
  isNonNullType,
  isObjectType,
  ...POLYMORPHIC_TYPE_CHECKS
];

export function isPolymorphicType(type) {
  return POLYMORPHIC_TYPE_CHECKS.find((checkType) => checkType(type));
}

export function isReslolveViaStrategyType(type) {
  return RESOLVE_VIA_STRATEGY_TYPE_CHECKS.find((checkType) => checkType(type));
}

// Test: it unwraps non-null types
// Test: it unwraps list types
// Test: it can unwrap a non-null list of non-null types
// Test: it can handle any other types
export function unwrapType(type, meta = { isList: false }) {
  const isList = isListType(type);

  if (isList || isNonNullType(type)) {
    if (!meta.isList) {
      meta.isList = isList;
    }

    return unwrapType(type.ofType, meta);
  }

  return { ...meta, type };
}
