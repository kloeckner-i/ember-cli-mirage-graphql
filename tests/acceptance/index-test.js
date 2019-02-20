import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

module('Acceptance | person', function(hooks) {
  setupApplicationTest(hooks);

  test('it displays the number of people in the db', async function(assert) {
    this.server.createList('person', 2);

    await visit('/');

    let numPeople = this.server.db.people.length;
    let numPeopleText = this.element.querySelector('.num-people').textContent;

    assert.ok(numPeople, 'There are some people in the database');
    assert.equal(numPeopleText, `Number of people: ${numPeople}`,
      'The number of people is displayed');
  });
});
