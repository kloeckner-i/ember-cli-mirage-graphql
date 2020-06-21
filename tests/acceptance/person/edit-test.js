import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { click, fillIn, visit } from '@ember/test-helpers';

module('Acceptance | edit person', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it can update a person via mutation', async function(assert) {
    const address = this.server.create('address');
    const person = this.server.create('person', { address, lastName: 'Smith' });
    const newLastName = 'Jones';

    await visit(`/person/${person.id}/edit`);

    const lastNameInput = this.element.querySelector('.person-last-name');

    assert.equal(lastNameInput.value, person.lastName, 'It has last name');

    await fillIn(lastNameInput, newLastName);
    await click('.person-save');

    const lastName = this.element.querySelector('.person-last-name');

    assert.equal(lastName.textContent, newLastName, 'The last name changed');
  });
});
