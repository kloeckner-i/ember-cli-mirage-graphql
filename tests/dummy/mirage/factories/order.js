import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

const { random } = faker;

export default Factory.extend({
  number: (i) => i,
  total: random.arrayElement([100, 200, 400, 500, 800, 1000])
});
