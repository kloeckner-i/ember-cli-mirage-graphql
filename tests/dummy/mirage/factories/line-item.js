import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

const { random } = faker;

export default Factory.extend({
  name: (i) => `Item ${i}`,
  quantity: random.arrayElement([1, 2, 3, 4, 5, 10, 20, 30])
});
