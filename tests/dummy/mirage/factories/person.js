import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

const { name, random } = faker;

export default Factory.extend({
  age: () => random.arrayElement([1, 10, 20, 30, 40, 50, 60, 70, 80, 90]),
  firstName: name.firstName,
  surname: name.lastName,
  createdAt: '2019-01-01'
});
