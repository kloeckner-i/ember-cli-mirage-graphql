import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { visit } from '@ember/test-helpers';

module('Acceptance | non null list of people', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it correctly unwraps non null list of non null items', async function(assert) {
    const address = this.server.create('address');

    this.server.createList('person', 2, { address });

    await visit('/people/non-null-list-of-people');

    let people = this.element.querySelectorAll('h2');

    assert.equal(people.length, 2, 'There are 2 people displayed');
  });
});
