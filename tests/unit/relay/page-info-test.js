import createPageInfo from 'ember-cli-mirage-graphql/relay/page-info';
import { module, test } from 'qunit';

module('Unit | Relay | page-info', function() {
  test('it creates page info if no records', function(assert) {
    assert.deepEqual(createPageInfo([]), {
      hasNextPage: false,
      hasPreviousPage: false
    }, 'It creates default page info');
  });

  test('it creates page info for records', function(assert) {
    let records = [{ id: '3' }, { id: '4' }, { id: '5' },
      { id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }
    ];
    let typeName = 'Foo';

    assert.deepEqual(createPageInfo(records, 0, 10, typeName), {
      hasNextPage: true,
      hasPreviousPage: true
    }, 'It creates page info');
  });
});
