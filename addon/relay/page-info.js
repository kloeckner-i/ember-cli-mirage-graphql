export default function createPageInfo(edges, firstRecordId, lastRecordId) {
  let hasPreviousPage = false;
  let hasNextPage = false;

  if (edges.length) {
    hasPreviousPage = edges[0].id !== firstRecordId;
    hasNextPage = edges[edges.length - 1].id !== lastRecordId;
  }

  return { hasNextPage, hasPreviousPage };
}
