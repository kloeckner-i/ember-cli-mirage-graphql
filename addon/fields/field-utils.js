import { camelize } from 'ember-cli-mirage/utils/inflector';
import { get } from '@ember/object';

export const getFieldName = ({ alias = {}, name = {}}) =>
  get(alias, 'value') || get(name, 'value');

export const getRecordInfo = (record, type, fieldName, parent, meta) =>
  ({ fieldName, meta, name: camelize(type.name), parent, record, type });

export const getTypeForField = (field, { _fields }) => _fields[field].type;
