export const getArgsForField = (field) =>
  field.arguments.map(({ name, value }) => ({
    [name.value]: {
      kind: value.kind,
      name: value.name && value.name.value,
      value: value.value
    }
  }));
