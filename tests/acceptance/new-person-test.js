import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { click, fillIn, visit } from '@ember/test-helpers';

module('Acceptance | new person', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it can create a person via mutation and handles an array response', async function(assert) {
    this.server.create('address');

    const newFirstName = 'Dave';
    const newLastName = 'Jones';
    const newAge = 44;

    assert.ok(this.server.db.people.length === 0, 'There are no people in the DB');

    await visit(`/person-new`);

    const firstNameInput = this.element.querySelector('#person-first-name');
    const lastNameInput = this.element.querySelector('#person-last-name');
    const ageInput = this.element.querySelector('#person-age');

    await fillIn(firstNameInput, newFirstName);
    await fillIn(lastNameInput, newLastName);
    await fillIn(ageInput, newAge);
    await click('.person-save');

    const lastName = this.element.querySelector('.person-last-name');

    assert.equal(lastName.textContent, newLastName, 'a person with with the correct last name was created');
    assert.ok(this.server.db.people.length === 1, 'a new person was persisted to the DB')
  });
})
