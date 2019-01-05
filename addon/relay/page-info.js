export function createPageInfo(records, firstRecordId, lastRecordId, typeName) {
  let hasPreviousPage = records[0].id !== firstRecordId;
  let hasNextPage = records[records.length - 1].id !== lastRecordId;
  let afterCursor = hasPreviousPage
    ? btoa(`${typeName}:${parseInt(records[0].id) - 1}`)
    : null;
  let beforeCursor = hasNextPage
    ? btoa(`${typeName}:${parseInt(records[records.length - 1].id) + 1}`)
    : null;

  return { afterCursor, beforeCursor, hasNextPage, hasPreviousPage };
}
