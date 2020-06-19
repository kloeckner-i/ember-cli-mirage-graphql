import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { visit } from '@ember/test-helpers';

module('Acceptance | customer', function(hooks) {
  let customer, orders;

  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    const lineItems = this.server.createList('line-item', 10);
    const order1 = this.server.create('order', { lineItems });
    const order2 = this.server.create('order');

    orders = [order1, order2];
    customer = this.server.create('customer', { orders });
  });

  test('it displays the customer data', async function(assert) {
    await visit(`/customer/${customer.id}`);

    assert.dom('.customer-name').hasText(customer.name);
    assert.dom('.order').exists({ count: 2 });
    assert.dom('.line-items tbody tr').exists({ count: 5 });
  });
});
