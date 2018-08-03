import { Factory, faker } from 'ember-cli-mirage';

const { list } = faker;

export default Factory.extend({
  name: (i) => `Item ${i}`,
  quanity: list.random(1, 2, 3, 4, 5, 10, 20, 30)
});
