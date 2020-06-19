/**
 * TODO: This could be better
 */
function encode(str) {
  return str
    .replace(':', '_')
    .split('')
    .reduce((encoded, chr) =>
      `${encoded}${String.fromCharCode(chr.charCodeAt(0) + 1)}`, '');
}

function hasField(type, fieldName) {
  return fieldName in type.getFields();
}

function isRelayPageInfoType(type) {
  return type.name === 'PageInfo' && hasField(type, 'startCursor');
}

export function isRelayConnectionType(type) {
  return type.name.endsWith('Connection') && hasField(type, 'edges');
}

export function isRelayEdgeType(type) {
  return type.name.endsWith('Edge') && hasField(type, 'node')
}

export function isRelayType(type) {
  return (
    isRelayConnectionType(type) ||
    isRelayEdgeType(type) ||
    isRelayPageInfoType(type)
  );
}

/**
 * TODO:
 *   - Document this. Also, how do we document classes with JSDoc?
 *   - Should this be a class or a set of functions that operate on basic data
 *     structures?
 * 
 * @param {Object} options
 */
export class RelayConnection {
  constructor({ args, edges = [], records, type } = {}) {
    if (!type?.name) {
      throw new Error('Invalid `type` option passed to constructor');
    }

    this.args = args;
    this.edges = edges;
    this.nodeType = type.name.replace(/Connection$/, '');
    this.pageInfo = this.setPageInfo();
    this.records = records;
  }

  createCursor(id) {
    return encode(`${this.nodeType}:${id}`);
  }

  setEdges() {
    this.edges = this.records.map((record) => ({
      cursor: this.createCursor(record.id),
      node: record
    }));

    return this;
  }

  setPageInfo() {
    const pageInfo = {
      hasPreviousPage: false,
      hasNextPage: false,
      startCursor: null,
      endCursor: null
    };

    if (this.edges?.length) {
      const [firstEdge] = this.edges;
      const lastEdge = this.edges[this.edges.length - 1];

      pageInfo.startCursor = firstEdge.cursor;
      pageInfo.endCursor = lastEdge.cursor;
      pageInfo.hasPreviousPage = firstEdge.node.id !== this.records[0].id;
      pageInfo.hasNextPage = lastEdge.id !==
        this.records[this.records.length - 1].id;
    }

    this.pageInfo = pageInfo;

    return this;
  }

  setRecords(records) {
    this.records = records;

    return this;
  }
}
