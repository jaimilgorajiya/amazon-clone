export const cart = [];

export function addToCart(productId){
    let matchingItem;
    cart.forEach((item) => {
      if (productId === item.productId) {
        matchingItem = item;
      }
    });

    if(matchingItem){
      matchingItem.quantity += 1;
    }
    else{
      cart.push({
        productId : productId,
        quantity : 1
      });
    }
};

export function updateCartQuantity(){
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  document.querySelector('.cart-quantity').innerText = cartQuantity;
};


