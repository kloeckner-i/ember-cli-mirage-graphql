import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

const { address } = faker;

export default Factory.extend({
  line1: address.streetAddress,
  line2: address.secondaryAddress,
  city: address.city,
  state: address.stateAbbr,
  zip: '54321'
});
