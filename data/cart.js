// data/cart.js
export let cart = JSON.parse(localStorage.getItem('cart')) || [];

if (!cart.length) {
  cart = [
    {
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '1',
    },
    {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1,
      deliveryOptionId: '2',
    },
  ];
}

function saveToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
  let matchingItem = cart.find((item) => item.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({
      productId: productId,
      quantity: 1,
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
