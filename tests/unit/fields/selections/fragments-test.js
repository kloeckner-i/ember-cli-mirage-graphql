import {
  composeFragmentReducer,
  composeInlineFragmentReducer,
  getIsFragment,
  getIsInlineFragment
} from 'ember-cli-mirage-graphql/fields/selections/fragments';
import { module, test } from 'qunit';
import { partial } from 'ember-cli-mirage-graphql/utils';

module('Unit | Fields | Selections | fragments', function() {
  test('it gets if a selection is a fragment', function(assert) {
    let fragmentSelection = { kind: 'FragmentSpread' };
    let selection = { kind: 'NotFragment' };

    assert.ok(getIsFragment(fragmentSelection), 'It returns true');
    assert.notOk(getIsFragment(selection), 'It returns false');
  });

  test('it unwraps selections for fragments', function(assert) {
    let fragmentSelection = {};
    let value = 'bar';
    let fragments = {
      [value]: {
        selectionSet: { selections: fragmentSelection }
      }
    };
    let selection = { name: { value } };
    let getIsFragment = () => true;
    let fragmentFieldsReducer = composeFragmentReducer(getIsFragment);
    let fragmentsReducer = partial(fragmentFieldsReducer, fragments);
    let reducedSelections = fragmentsReducer(['foo'], selection);

    assert.deepEqual(reducedSelections, ['foo', fragmentSelection],
      'It unwrapped the selections');
  });

  module('inline fragment', function() {
    test('it gets if a selection is an inline fragment', function(assert) {
      let inlineFragmentSelection = { kind: 'InlineFragment' };
      let selection = { kind: 'NotInlineFragment' };

      assert.ok(getIsInlineFragment(inlineFragmentSelection),
        'It returns true');
      assert.notOk(getIsInlineFragment(selection), 'It returns false');
    });

    test('it unwraps selections for inline fragments', function(assert) {
      let inlineSelection = {};
      let selection = { selectionSet: { selections: [inlineSelection] } };
      let getIsInlineFragment = () => true;
      let inlineFragmentFieldsReducer =
        composeInlineFragmentReducer(getIsInlineFragment);
      let reducedSelections = inlineFragmentFieldsReducer(['foo'], selection);

      assert.deepEqual(reducedSelections, ['foo', inlineSelection],
        'It unwrapped the selections');
    });
  });
});
