export const getAreRecordsEmpty = ([firstRecord]) =>
  firstRecord == null || !Object.keys(firstRecord).length;

export const getParentRecord = (parent) => !parent
  ? null
  : parent.field.isRelayConnection
    ? parent.field.parent.record
    : parent.record;
