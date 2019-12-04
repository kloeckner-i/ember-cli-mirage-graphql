import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { click, fillIn, visit } from '@ember/test-helpers';

module('Acceptance | edit person', function(hooks) {
  setupApplicationTest(hooks);

  test('it can update a person via mutation', async function(assert) {
    let person = server.create('person', { surname: 'Smith' });
    let newLastName = 'Jones';

    await visit(`/person/${person.id}/edit`);

    let lastNameInput = this.element.querySelector('.person-last-name');

    assert.equal(lastNameInput.value, person.surname, 'It has last name');

    await fillIn(lastNameInput, newLastName);
    await click('.person-save');

    let lastName = this.element.querySelector('.person-last-name');

    assert.equal(lastName.textContent, newLastName, 'The last name changed');
  });
});
