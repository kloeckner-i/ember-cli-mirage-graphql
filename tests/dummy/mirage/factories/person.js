import { Factory, faker } from 'ember-cli-mirage';

const { list, name } = faker;

export default Factory.extend({
  age: (i) => list.random(1, 10, 20, 30, 40, 50, 60, 70, 80, 90)(i),
  firstName: name.firstName,
  surname: name.lastName
});
