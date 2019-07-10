export const getArgsForField = (field) =>
  field.arguments.map(({ name, value }) => ({
    kind: value.kind,
    name: name.value,
    value: value.value,
    variableName: value.name && value.name.value
 }));


export const resolveArgName = (name, argsMap = {}) =>
  name in argsMap ? argsMap[name] : name;
