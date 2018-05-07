import { Factory, faker } from 'ember-cli-mirage';

const { list, name } = faker;

export default Factory.extend({
  age: (i) => list.random(1, 3, 5, 7, 9, 11, 13, 15)(i),
  name: name.firstName,
  type: (i) => list.random('dog', 'cat', 'hamster', 'rabbit', 'turtle')(i)
});
