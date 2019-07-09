import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

module('Acceptance | variables', function(hooks) {
  setupApplicationTest(hooks);

  test('variable values are passed correctly at multiple depths', async function(assert) {
    let person = this.server.create('person', { firstName: 'Alice', surname: 'Example' });

    this.server.create('animal', { person, type: 'dog', name: 'Bob' });
    this.server.create('animal', { person, type: 'dog', name: 'Alice' });

    await visit('/people/same-name-as-pets');

    assert.dom('h2').containsText('Alice');
    assert.dom('li').containsText('Alice');
    assert.dom('li').doesNotContainText('Bob');
  });
});
