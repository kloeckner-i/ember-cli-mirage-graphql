import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

const NUM_PETS = 3;

module('Acceptance | person', function(hooks) {
  let person;

  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    person = this.server.create('person');

    this.server.createList('animal', NUM_PETS, { person });
  });

  test('it can map field names(pets => animals)', async function(assert) {
    await visit(`/person/${person.id}`);

    let petRows = this.element.querySelectorAll('.person-pets tbody tr');

    assert.equal(petRows.length, NUM_PETS, `${NUM_PETS} are displayed`);
  });
});
