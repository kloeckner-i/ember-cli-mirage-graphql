import { Factory, faker } from 'ember-cli-mirage';

const { list } = faker;

export default Factory.extend({
  number: (i) => i,
  total: list.random(100, 200, 400, 500, 800, 1000)
});
