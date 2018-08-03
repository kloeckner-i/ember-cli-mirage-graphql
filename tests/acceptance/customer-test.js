import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

module('Acceptance | customer', function(hooks) {
  let customer, orders;

  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    customer = this.server.create('customer');
    orders = this.server.createList('order', 2, { customer });

    let [order] = orders;

    this.server.createList('line-item', 10, { order });
    this.server.createList('order-category', 5, { order });
  });

  test('it displays the customer name', async function(assert) {
    await visit(`/customer/${customer.id}`);

    assert.dom('.customer-name').hasText(customer.name);
  });
});
