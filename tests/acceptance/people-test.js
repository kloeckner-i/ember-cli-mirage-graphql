import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

module('Acceptance | people', function(hooks) {
  const getTableRows = ({ element }) =>
    element.querySelectorAll('.people tbody tr');

  setupApplicationTest(hooks);

  test('it can map var names (pageSize => function)', async function(assert) {
    this.server.createList('person', 10);

    await visit('/people?pageSize=5');

    let tableRows = getTableRows(this);

    assert.equal(tableRows.length, 5, 'There are 5 people displayed');
  });

  test('it can filter records with vars (firstName)', async function(assert) {
    this.server.createList('person', 10, { firstName: 'Joe' });

    let numToms = 4;
    let firstName = 'Tom';

    this.server.createList('person', numToms, { firstName });

    await visit(`/people?firstName=${firstName}`);

    let tableRows = getTableRows(this);
    let smiths = [...tableRows].filter((row) =>
      row.querySelector('.people-first-name', row).textContent === firstName);

    assert.equal(tableRows.length, numToms,
      `There are ${numToms} people displayed`);
    assert.equal(smiths.length, numToms,
      `Only people having the first name "${firstName}" are displayed`);
  });

  test('it can filter records with mapped vars (lastName)', async function(assert) {
    this.server.createList('person', 10, { surname: 'Thomas' });

    let surname = 'Smith';
    let numSmiths = 4;

    this.server.createList('person', numSmiths, { surname });

    await visit(`/people?lastName=${surname}`);

    let tableRows = getTableRows(this);
    let smiths = [...tableRows].filter((row) =>
      row.querySelector('.people-last-name', row).textContent === surname);

    assert.equal(tableRows.length, numSmiths,
      `There are ${numSmiths} people displayed`);
    assert.equal(smiths.length, numSmiths,
      `Only people having the last name "${surname}" are displayed`);
  });

  async function testBelongsTo(context, assert, address) {
    await visit('/people');

    let tableRow = getTableRows(context)[0];
    let line1 = tableRow.querySelector('.people-address-line-1').textContent;
    let line2 = tableRow.querySelector('.people-address-line-2').textContent;
    let city = tableRow.querySelector('.people-address-city').textContent;
    let state = tableRow.querySelector('.people-address-state').textContent;
    let zip = tableRow.querySelector('.people-address-zip').textContent;

    assert.equal(line1, address.line1, 'It displays address line 1');
    assert.equal(line2, address.line2, 'It displays address line 2');
    assert.equal(city, address.city, 'It displays address city');
    assert.equal(state, address.state, 'It displays address state');
    assert.equal(zip, address.zip, 'It displays address zip');
  }

  test('it can display belongsTo related data 1', function(assert) {
    let address = server.create('address');

    this.server.create('person', { address });

    testBelongsTo(this, assert, address);
  });

  test('it can display belongsTo related data 2', function(assert) {
    let person = this.server.create('person');
    let address = server.create('address', { person });

    testBelongsTo(this, assert, address);
  });

  test('it can display hasMany related data 1', async function(assert) {
    let animals = this.server.createList('animal', 3);

    this.server.create('person', { animals });

    await visit('/people');

    let tableRow = getTableRows(this)[0];
    let animalCount = tableRow.querySelector('.people-animal-count');

    assert.equal(animals.length, animalCount.textContent,
      'It displays the number of animals');
  });

  test('it can display hasMany related data 2', async function(assert) {
    let person = this.server.create('person');
    let animals = this.server.createList('animal', 3, { person });

    await visit('/people');

    let tableRow = getTableRows(this)[0];
    let animalCount = tableRow.querySelector('.people-animal-count');

    assert.equal(animals.length, animalCount.textContent,
      'It displays the number of animals');
  });
});
