export const mapRecordToEdge = (typeName) => (record) => ({
  cursor: btoa(`${typeName}:${record.id}`),
  node: record
});
