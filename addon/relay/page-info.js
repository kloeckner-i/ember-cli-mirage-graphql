export function createPageInfo(options) {
  if (!options) {
    return { after: null, before: null, endCursor: null, startCursor: null };
  }

  let { edges, firstRecordId, lastRecordId, typeName } = options;
  let hasPreviousPage = edges[0].id !== firstRecordId;
  let hasNextPage = edges[edges.length - 1].id !== lastRecordId;
  let afterCursor = hasPreviousPage
    ? btoa(`${typeName}:${parseInt(edges[0].id) - 1}`)
    : null;
  let beforeCursor = hasNextPage
    ? btoa(`${typeName}:${parseInt(edges[edges.length - 1].id) + 1}`)
    : null;

  return { afterCursor, beforeCursor, hasNextPage, hasPreviousPage };
}
