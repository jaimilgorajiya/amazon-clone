import {cart , deleteItem , updateDeliveryOption} from '../../data/cart.js';
import {products} from '../../data/products.js';
import {deliveryOptions} from '../../data/deliveryOptions.js';

const today = dayjs().format('dddd, MMMM D');
console.log(today);


export function renderOrderSummary(){
    let cartSummaryHTML = '';

    cart.forEach((cartItem) => {

        const productId = cartItem.productId;
        let matchingProduct;

        products.forEach((product) => {
            if(product.id === productId){
                matchingProduct = product;
            }
        });



    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption;

    deliveryOptions.forEach((option) => {
        if(option.id === deliveryOptionId){
            deliveryOption = option;
        }
    });
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');



    cartSummaryHTML +=`    
        <div class="cart-item-container cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
            Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
            <img class="product-image"
                src="${matchingProduct.image}">

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
                <span class="update-quantity-link link-primary">
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
                ${deliveryOptionsHTML(matchingProduct , cartItem)}
            </div>
            </div>
        </div>
        `;
    });

    function deliveryOptionsHTML(matchingProduct, cartItem) {
        let html = '';
    
        deliveryOptions.forEach((deliveryOption) => {
            const today = dayjs();
            const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
            const dateString = deliveryDate.format('dddd, MMMM D');
    
            const priceString = deliveryOption.priceCent === 0
                ? 'FREE'
                : `$${(deliveryOption.priceCent / 100).toFixed(2)} - `;
    
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
    

    document.querySelector('.order-summary').innerHTML = cartSummaryHTML;

    document.querySelectorAll('.delete-quantity-link').forEach((deleteLink) => {
        deleteLink.addEventListener('click' , () => {
            const productId = deleteLink.dataset.productId;
            deleteItem(productId);
            const container = document.querySelector(`.cart-item-container-${productId}`);
            container.remove();
        });
    });

    document.querySelectorAll('.js-delivery-option').forEach((input) => {
        input.addEventListener('change' , () => {
            const {productId , deliveryOptionId} = input.dataset;    
            updateDeliveryOption(productId , deliveryOptionId);
            renderOrderSummary();
        });
    });
} 

