import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { click, fillIn, visit } from '@ember/test-helpers';

module('Acceptance | new person', function(hooks) {
  setupApplicationTest(hooks);

  test('it can create a person via mutation and handles an array response', async function(assert) {
    let newFirstName = 'Dave';
    let newLastName = 'Jones';
    let newAge = 44;

    assert.ok(this.server.db.people.length === 0)

    await visit(`/person-new`);


    let firstNameInput = this.element.querySelector('#person-first-name');
    let lastNameInput = this.element.querySelector('#person-last-name');
    let ageInput = this.element.querySelector('#person-age');

    await fillIn(firstNameInput, newFirstName);
    await fillIn(lastNameInput, newLastName);
    await fillIn(ageInput, newAge);
    await click('.person-save');

    let lastName = this.element.querySelector('.person-last-name');

    assert.equal(lastName.textContent, newLastName, 'a person with with the correct last name was created');
    assert.ok(this.server.db.people.length === 1, 'a new person was persisted to the DB')
  });
})
