export function createPageInfo(edges, firstRecordId, lastRecordId, typeName) {
  let endCursor = null;
  let hasPreviousPage = false;
  let hasNextPage = false;
  let startCursor = null;

  if (edges.length) {
    hasPreviousPage = edges[0].node.id !== firstRecordId;
    hasNextPage = edges[edges.length - 1].node.id !== lastRecordId;
    startCursor = hasPreviousPage
      ? btoa(`${typeName}:${parseInt(edges[0].id) - 1}`)
      : null;
    endCursor = hasNextPage
      ? btoa(`${typeName}:${parseInt(edges[edges.length - 1].id) + 1}`)
      : null;
  }

  return { endCursor, hasNextPage, hasPreviousPage, startCursor };
}
