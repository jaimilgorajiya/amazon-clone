import { cart, clearCart } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';    
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { saveOrder } from '../../data/orders.js';

export function renderPaymentSummary() {
    let productPriceCents = 0;
    let shippingPriceCents = 0;
    let itemsCount = 0;

    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

        // Debugging: check values
        if (!product || typeof product.priceCents !== 'number') {
            console.error('Invalid product data for:', cartItem.productId, product);
            return;
        }

        if (!deliveryOption || typeof deliveryOption.priceCents !== 'number') {
            console.error('Invalid delivery option for:', cartItem.deliveryOptionId, deliveryOption);
            return;
        }

        productPriceCents += product.priceCents * cartItem.quantity;
        shippingPriceCents += deliveryOption.priceCents;
        itemsCount += cartItem.quantity;
    });

    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforeTaxCents * 0.1;
    const totalCents = totalBeforeTaxCents + taxCents;

    const paymentSummaryHTML = `
        <div class="payment-summary-title">
          Order Summary
        </div>

        <div class="payment-summary-row">
          <div>Items (${itemsCount}):</div>
          <div class="payment-summary-money">$${(productPriceCents / 100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row">
          <div>Shipping &amp; handling:</div>
          <div class="payment-summary-money">$${(shippingPriceCents / 100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
          <div>Total before tax:</div>
          <div class="payment-summary-money">$${(totalBeforeTaxCents / 100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row">
          <div>Estimated tax (10%):</div>
          <div class="payment-summary-money">$${(taxCents / 100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row total-row">
          <div>Order total:</div>
          <div class="payment-summary-money">$${(totalCents / 100).toFixed(2)}</div>
        </div>

        <button class="place-order-button button-primary">
          Place your order
        </button>
    `;

    document.querySelector('.payment-summary').innerHTML = paymentSummaryHTML;

    document.querySelector('.place-order-button').addEventListener('click', () => {
        const order = {
            id: 'ord-' + Date.now().toString(),
            items: [...cart],
            orderDate: new Date().toISOString(),
            total: {
                productPriceCents,
                shippingPriceCents,
                taxCents,
                totalCents
            },
            status: 'processing'
        };

        saveOrder(order);
        clearCart();

        window.location.href = 'orders.html';
    });
}
