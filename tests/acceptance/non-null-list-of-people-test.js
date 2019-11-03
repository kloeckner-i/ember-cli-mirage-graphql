import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

module('Acceptance | non null list of people', function(hooks) {
  setupApplicationTest(hooks);

  test('it correctly unwraps non null list of non null items', async function(assert) {
    server.createList('person', 2);

    await visit('/people/non-null-list-of-people');

    let people = this.element.querySelectorAll('h2');

    assert.equal(people.length, 2, 'There are 2 people displayed');
  });
});
