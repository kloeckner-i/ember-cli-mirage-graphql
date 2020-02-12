import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

module('Acceptance | union', function(hooks) {
  setupApplicationTest(hooks);

  test('it is able to resolve union types', async function(assert) {
    let person = this.server.create('person', {
      firstName: 'Alice',
      lastName: 'Example',
      age: 30
    });
    let pet = this.server.create('animal', {
      name: 'Beanie',
      age: 10
    });

    await visit('/pets-and-people');

    assert
      .dom('.pet-id')
      .containsText(pet.id);
    assert
      .dom('.pet-name')
      .containsText(pet.name);
    assert
      .dom('.pet-age')
      .containsText(pet.age);
    assert
      .dom('.person-id')
      .containsText(person.id);
    assert
      .dom('.person-name')
      .containsText(`${person.firstName} ${person.lastName}`);
    assert
      .dom('.person-age')
      .containsText(person.age);
  })
});
