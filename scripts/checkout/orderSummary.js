import { cart, deleteItem, updateDeliveryOption } from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import { deliveryOptions , getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);

    // Check if the product exists
    if (!matchingProduct) {
      console.error(`Product with ID ${productId} not found.`);
      return;
    }

    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    cartSummaryHTML += `    
      <div class="cart-item-container cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${(matchingProduct.priceCents / 100).toFixed(2)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                Update
              </span>
              <span class="delete-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector('.order-summary').innerHTML = cartSummaryHTML;

  // Delete functionality
  document.querySelectorAll('.delete-quantity-link').forEach((deleteLink) => {
    deleteLink.addEventListener('click', () => {
      const productId = deleteLink.dataset.productId;
      deleteItem(productId);
      const container = document.querySelector(`.cart-item-container-${productId}`);
      container.remove();
      renderPaymentSummary();
    });
  });

  // Delivery option update
  document.querySelectorAll('.js-delivery-option').forEach((input) => {
    input.addEventListener('click', () => {
      const { productId, deliveryOptionId } = input.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  // Update quantity functionality
  document.querySelectorAll('.update-quantity-link').forEach((updateLink) => {
    updateLink.addEventListener('click', () => {
      const quantityContainer = updateLink.closest('.product-quantity');
      const quantityLabel = quantityContainer.querySelector('.quantity-label');
      const currentQuantity = quantityLabel.textContent;
      const productId = updateLink.dataset.productId;

      // Replace quantity display with input and save button
      quantityContainer.innerHTML = `
        <input type="number" min="1" value="${currentQuantity}" class="quantity-input">
        <button class="save-quantity-button link-primary">Save</button>
      `;

      quantityContainer.querySelector('.save-quantity-button').addEventListener('click', () => {
        const newQuantity = parseInt(quantityContainer.querySelector('.quantity-input').value);

        if (newQuantity > 0) {
          // Update quantity in cart
          const cartItem = cart.find(item => item.productId === productId);
          cartItem.quantity = newQuantity;

          // Re-render
          renderOrderSummary();
          renderPaymentSummary();
        }
      });
    });
  });
}

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = '';

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    const priceString = deliveryOption.priceCents === 0
      ? 'FREE'
      : `$${(deliveryOption.priceCents / 100).toFixed(2)} - `;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += `
      <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">

        <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}"
          id="delivery-option-${matchingProduct.id}-${deliveryOption.id}">

        <label for="delivery-option-${matchingProduct.id}-${deliveryOption.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </label>
      </div>
    `;
  });

  return html;
}
