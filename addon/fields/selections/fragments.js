export const getIsFragment = ({ kind }) => kind === 'FragmentSpread';
export const getIsInlineFragment = ({ kind }) => kind === 'InlineFragment';

export const composeFragmentReducer = (getIsFieldFragment) =>
  (fragments, selections, selection) =>
    selections.concat(
      getIsFieldFragment(selection)
        ? fragments[selection.name.value].selectionSet.selections
        : selection
    );

export const fragmentFieldsReducer = composeFragmentReducer(getIsFragment);

export const composeInlineFragmentReducer = (getIsFieldInlineFragment) =>
  (selections, selection) =>
    selections.concat(
      getIsFieldInlineFragment(selection)
        ? selection.selectionSet.selections
        : selection
    );

export const inlineFragmentFieldsReducer =
  composeInlineFragmentReducer(getIsInlineFragment);
