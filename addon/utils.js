import { camelize, pluralize } from 'ember-cli-mirage/utils/inflector';
import { get } from '@ember/object';
import { isArray } from '@ember/array';

const PROP_FOR_TYPE = 'returnType';
const PROP_FOR_LIST_TYPE = `${PROP_FOR_TYPE}.ofType`;

export function contextSet(obj, k, v) {
  obj[k] = v;

  return obj;
}

export const getIsList = (meta) => !!get(meta, PROP_FOR_LIST_TYPE);

export function getTableByType(db, { name }) {
  let recordType = camelize(name);
  let records = db[pluralize(recordType)];

  return { recordType, records };
}

export const getTypeFromMeta = (meta, isList) =>
  get(meta, isList ? PROP_FOR_LIST_TYPE : PROP_FOR_TYPE);

export const isFunction = (obj) => obj != null && typeof obj === 'function';

export const isObject = (obj) =>
  obj && !isArray(obj) && typeof obj === 'object';
