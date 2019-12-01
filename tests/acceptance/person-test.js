import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

module('Acceptance | person', function(hooks) {
  setupApplicationTest(hooks);

  async function testBelongsTo(context, assert, person, address) {
    await visit(`/person/${person.id}`);

    let { element } = context;

    let line1 = element.querySelector('.person-address-line-1').textContent;
    let line2 = element.querySelector('.person-address-line-2').textContent;
    let city = element.querySelector('.person-address-city').textContent;
    let state = element.querySelector('.person-address-state').textContent;
    let zip = element.querySelector('.person-address-zip').textContent;
    let createdAt = element.querySelector('.person-created-at').textContent;

    assert.equal(line1, address.line1, 'It displays address line 1');
    assert.equal(line2, address.line2, 'It displays address line 2');
    assert.equal(city, address.city, 'It displays address city');
    assert.equal(state, address.state, 'It displays address state');
    assert.equal(zip, address.zip, 'It displays address zip');
    assert.equal(createdAt, person.createdAt, 'It displays person created at');
  }

  async function testShowsPerson(context, assert, path, person) {
    await visit(path);

    let { element } = context;

    let firstName = element.querySelector('.person-first-name').textContent;
    let lastName = element.querySelector('.person-last-name').textContent;
    let age = element.querySelector('.person-age').textContent;
    let createdAt = element.querySelector('.person-created-at').textContent;

    assert.equal(firstName, person.firstName, 'It displays the first name');
    assert.equal(lastName, person.surname, 'It displays the last name');
    assert.equal(age, person.age.toString(), 'It displays the age');
    assert.equal(createdAt, person.createdAt, 'It displays when it was created');
  }

  test('it can display belongsTo related data 1', async function(assert) {
    let address = server.create('address');
    let person = server.create('person', { address });

    testBelongsTo(this, assert, person, address);
  });

  test('it can display belongsTo related data 2', async function(assert) {
    let person = server.create('person');
    let address = server.create('address', { person });

    testBelongsTo(this, assert, person, address);
  });

  test('it can display hasMany related data 1', async function(assert) {
    let numPets = 3;
    let animals = this.server.createList('animal', numPets);
    let person = this.server.create('person', { animals });

    await visit(`/person/${person.id}`);

    let petRows = this.element.querySelectorAll('.person-pets tbody tr');

    assert.equal(petRows.length, numPets, `${numPets} pets are displayed`);
  });

  test('it can display hasMany related data 2', async function(assert) {
    let numPets = 3;
    let person = this.server.create('person');

    this.server.createList('animal', numPets, { person });

    await visit(`/person/${person.id}`);

    let petRows = this.element.querySelectorAll('.person-pets tbody tr');

    assert.equal(petRows.length, numPets, `${numPets} pets are displayed`);
  });

  test('it can display data from the second person in a collection', async function(assert) {
    let numPeople = 3;
    let people = this.server.createList('person', numPeople);
    let person = people[1]
    let path = `/person/${person.id}`

    testShowsPerson(this, assert, path, person)
  })

  test('it can display data from the second person in a collection as Prisma would query it', async function(assert) {
    let numPeople = 3;
    let people = this.server.createList('person', numPeople);
    let person = people[1]
    let path = `/person-like-prisma/${person.id}`

    testShowsPerson(this, assert, path, person)
  })
});
