export let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity = 1) {
  let matchingItem = cart.find((item) => item.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += quantity; // Add the quantity to the existing item
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: '1',
    });
  }
  saveToLocalStorage();
}

export function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  document.querySelector('.cart-quantity').innerText = cartQuantity;
}

export function deleteItem(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  saveToLocalStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem = cart.find((item) => item.productId === productId);
  if (matchingItem) {
    matchingItem.deliveryOptionId = deliveryOptionId;
    saveToLocalStorage();
  }
}

// Clear the cart
export function clearCart() {
  cart = [];
  saveToLocalStorage();
}
