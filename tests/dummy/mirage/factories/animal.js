import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

const { name, random } = faker;

export default Factory.extend({
  age: () => random.arrayElement([1, 3, 5, 7, 9, 11, 13, 15]),
  name: name.firstName,
  type: () => random.arrayElement(['dog', 'cat', 'hamster', 'rabbit', 'turtle'])
});
