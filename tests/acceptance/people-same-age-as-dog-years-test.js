import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

module('Acceptance | people', function(hooks) {
  setupApplicationTest(hooks);

  function createPeopleWithOneYearOldDogs(server) {
    let people = server.createList('person', 5);

    people.forEach((person) => server.create('animal', {
      type: 'dog',
      age: 1,
      person
    }));
  }

  function createPeopleWithDogsSameAge(server) {
    let dog1 = server.create('animal', { type: 'dog', age: 3 });
    let dog2 = server.create('animal', { type: 'dog', age: 5 });

    server.create('person', { age: 21, animals: [dog1] });
    server.create('person', { age: 35, animals: [dog2] });
  }

  test('it only displays people having at least one dog with their same age in dog years', async function(assert) {
    assert.expect(3);

    createPeopleWithOneYearOldDogs(this.server);
    createPeopleWithDogsSameAge(this.server);

    await visit('/people/same-age-as-dog-years');

    let tableRows = this.element.querySelectorAll('.people tbody tr');

    assert.equal(tableRows.length, 2, 'There are 2 people displayed');

    [...tableRows].forEach((row) => {
      let age = parseInt(row.querySelector('.people-age').textContent);
      let petAge = parseInt(row.querySelector('.people-pet-age').textContent);

      assert.equal(age, petAge * 7,
        'The person is the same age as the dog in dog years');
    });
  });
});
