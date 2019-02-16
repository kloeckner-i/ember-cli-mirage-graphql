import { get } from '@ember/object';

export const getFieldNameAndAlias = (field) => ({
  fieldAlias: get(field, 'alias.value'),
  fieldName: get(field, 'name.value')
});
