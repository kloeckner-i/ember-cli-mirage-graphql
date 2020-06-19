import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { visit } from '@ember/test-helpers';

/**
 * TODO: Determine the value of some of the relationship tests here. Are we
 * duplicating some of the same tests from the person test?
 */
module('Acceptance | people', function(hooks) {
  const getTableRows = ({ element }) =>
    element.querySelectorAll('.people tbody tr');

  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it can filter records with vars (firstName)', async function(assert) {
    this.server.createList('person', 10, { firstName: 'Joe' });
    
    const address = this.server.create('address');
    const numToms = 4;
    const firstName = 'Tom';

    this.server.createList('person', numToms, { address, firstName });

    await visit(`/people?firstName=${firstName}`);

    const tableRows = getTableRows(this);
    const smiths = [...tableRows].filter((row) =>
      row.querySelector('.people-first-name', row).textContent === firstName);

    assert.equal(tableRows.length, numToms,
      `There are ${numToms} people displayed`);
    assert.equal(smiths.length, numToms,
      `Only people having the first name "${firstName}" are displayed`);
  });

  async function testBelongsTo(context, assert, address) {
    await visit('/people');

    const tableRow = getTableRows(context)[0];
    const line1 = tableRow.querySelector('.people-address-line-1').textContent;
    const line2 = tableRow.querySelector('.people-address-line-2').textContent;
    const city = tableRow.querySelector('.people-address-city').textContent;
    const state = tableRow.querySelector('.people-address-state').textContent;
    const zip = tableRow.querySelector('.people-address-zip').textContent;

    assert.equal(line1, address.line1, 'It displays address line 1');
    assert.equal(line2, address.line2, 'It displays address line 2');
    assert.equal(city, address.city, 'It displays address city');
    assert.equal(state, address.state, 'It displays address state');
    assert.equal(zip, address.zip, 'It displays address zip');
  }

  test('it can display belongsTo related data 1', function(assert) {
    const address = server.create('address');

    this.server.create('person', { address });

    testBelongsTo(this, assert, address);
  });

  // TODO: Is this test valuable?
  test('it can display hasMany related data', async function(assert) {
    const address = this.server.create('address');
    const pets = this.server.createList('pet', 3);

    this.server.create('person', { address, pets });

    await visit('/people');

    const tableRow = getTableRows(this)[0];
    const animalCount = tableRow.querySelector('.people-animal-count');

    assert.equal(pets.length, animalCount.textContent,
      'It displays the number of animals');
  });
});
