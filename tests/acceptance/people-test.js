import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

const ROWS_SELECTOR = '.people tbody tr';

module('Acceptance | people', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.server.createList('person', 10);
    this.server.createList('person', 4, { lastName: 'Smith' });
  });

  test('it can map variable names (pageSize => function)', async function(assert) {
    await visit('/people?pageSize=5');

    let tableRows = this.element.querySelectorAll(ROWS_SELECTOR);

    assert.equal(tableRows.length, 5, 'There are 5 people displayed');
  });

  test('it can filter records with variables (lastName)', async function(assert) {
    await visit('/people?lastName=Smith');

    let tableRows = this.element.querySelectorAll(ROWS_SELECTOR);
    let smiths = [...tableRows].filter((row) =>
      row.querySelector('.people-last-name', row).textContent === 'Smith');

    assert.equal(tableRows.length, 4, 'There are 4 people displayed');
    assert.equal(smiths.length, 4,
      'Only people having the last name "Smith" are displayed');
  });
});
