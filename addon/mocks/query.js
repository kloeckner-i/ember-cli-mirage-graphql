// import { GraphQLList } from 'graphql';
import { getTypeForField } from '../type';
// import { filterRecords } from '../filter/filter-records';
// import { getRecordsByType } from '../db';
// import { maybeMapFieldByFunction } from '../fields/map';
import { partial } from '../utils';
// import { resolveFieldsForRecords } from '../fields/resolve';

// const determineReturnValue = ([{ returnType }, records]) =>
//   returnType instanceof GraphQLList ? records : records[0];

const getFieldName = ({ alias, name }) => alias && alias.value || name.value;

const reduceAnyInlineFragmentSelections = (selections, selection) =>
  selection.kind === 'InlineFragment'
    ? [...selections, ...selection.selectionSet.selections]
    : [...selections, selection];

const reduceSelectedFields = (type, getType) => (selections, selection) => {
  let fieldName = getFieldName(selection);
  let { selectionSet } = selection;

  if (fieldName === '__typename') {
    return selections;
  }

  if (!selectionSet) {
    return [...selections, fieldName];
  }

  let fieldType = type._fields[fieldName].type;

  return [
    ...selections,
    createFieldInfo(selection, fieldType, getType)
  ];
}

function getSelectedFields({ selectionSet = {} }, type, getType) {
  let { selections = [] } = selectionSet;
  let selectedFields = selections
    .reduce(reduceAnyInlineFragmentSelections, [])
    .reduce(reduceSelectedFields(type, getType), []);

  return selectedFields;
}

function getFiltersForField(field) {
  // TODO: Create filters
}

function createFieldInfo(field, type, getType) {
  let fieldName = getFieldName(field);
  let typeInfo = getType(field, type);
  let fields = getSelectedFields(field, typeInfo.type, getType);
  let filters = getFiltersForField(field);
  let fieldInfo = { [fieldName]: { fields, filters, typeInfo } };

  return fieldInfo;
}

function resolveFieldInfo(fieldInfo) {
  debugger;
}

const mockQueryFn = (db, options) =>
  (_, vars, __, { fieldNodes, returnType, schema }) => {
    let getType = partial(getTypeForField, schema._typeMap);
    let [rootField] = fieldNodes;
    let rootFieldInfo = createFieldInfo(rootField, returnType, getType);
    let records = resolveFieldInfo(rootFieldInfo);

    return records;

    // const getAllRecordsByType = pipe(
    //   determineType(schema._typeMap),
    //   getRecordsByType(db)
    // );
    // const getRecords = pipe(
    //   getAllRecordsByType,
    //   filterRecords(db, vars, options),
    //   resolveFieldsForRecords(getAllRecordsByType, options),
    //   maybeMapFieldByFunction(db, options),
    //   determineReturnValue
    // );
    // let records = getRecords(fieldNodes[0], returnType, getRecords);
  };

export default mockQueryFn;
