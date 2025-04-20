// data/orders.js
let orders = JSON.parse(localStorage.getItem('orders')) || [];

export function saveOrder(order) {
  orders.unshift(order); // Add new order at beginning
  localStorage.setItem('orders', JSON.stringify(orders));
}

export function getOrders() {
  return orders;
}