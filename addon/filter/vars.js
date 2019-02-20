export const resolveVarName = (name, varsMap = {}) =>
  name in varsMap ? varsMap[name] : name;
