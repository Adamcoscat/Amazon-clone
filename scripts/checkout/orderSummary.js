import {cart, removeCartItem, updateDeliveryOption, calcCart} from '../../data/cart.js';
import {products, matchItem} from '../../data/products.js';
import dayjs from '../dayjs+esm.js';
import {deliveryOptions, getDeliveryOption, calcDeliveryDate} from '../../data/deliveryOptions.js';
import {renderPaymentSummary} from './paymentSummary.js';
import isSatSun from './isWeekend.js'

export function renderOrderSummary() {
let cartSummaryHTML;
cart.forEach(cartItem => {
	const productId = cartItem.productId;
	
  const matchingItem = matchItem(productId);
	
	const deliveryOptionId = cartItem.deliveryOptionId;
	
	const deliveryOption = getDeliveryOption(deliveryOptionId);
	
	const dateString = calcDeliveryDate(deliveryOption);
	
	cartSummaryHTML += `
		<div class="cart-item-container js-cart-item-container-${matchingItem.id}">
		<div class="delivery-date" data-product-id="${matchingItem.id}">
		
              Delivery date:  ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingItem.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingItem.name}
                </div>
                <div class="product-price">
                  $${(matchingItem.priceCents/100).toFixed(2)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary" data-product-id="${matchingItem.id}">
                    Update
                  </span>
                  <span data-product-id="${matchingItem.id}" class="js-delete-quantity-link delete-quantity-link link-primary">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
								${renderDeliveryOptions(matchingItem, cartItem)}
              </div>
            </div>
          </div>
	`; 
	
})

document.querySelector('.order-summary').innerHTML = cartSummaryHTML;
function updateItems() {
	const cartQuantity = calcCart();

	document.querySelector('.return-to-home-link').innerText = `${cartQuantity} items`
}

updateItems();

function renderDeliveryOptions(matchingItem, cartItem) {
	
	let html = '';
	
	
	deliveryOptions.forEach(option => {
		const isChecked = option.id === cartItem.deliveryOptionId;
		let dateString = calcDeliveryDate(option);
		const priceString = option.priceCents 
		=== 0
			? 'FREE'
			: `$${(option.priceCents/100).toFixed('2')}`
			
		html += `
			<div class="delivery-option" data-product-id="${matchingItem.id}"
			data-delivery-option-id="${option.id}">
				<input type="radio" ${isChecked ? 'checked' : ''}
					class="delivery-option-input"
					name="delivery-option-${matchingItem.id}">
				<div>
					<div class="delivery-option-date">
						${dateString}
					</div>
					<div class="delivery-option-price">
						${priceString} Shipping
					</div>
				</div>
			</div>
		`
	})
	
	return html
}

document.querySelectorAll('.js-delete-quantity-link').forEach(span => {
		span.addEventListener('click', () => {
			const productId = span.dataset.productId;
			removeCartItem(productId);
			updateItems();
			renderOrderSummary();
			renderPaymentSummary();
		})
	})
	
	 document.querySelectorAll('.delivery-option').forEach(option => {
		option.addEventListener('click', () => {
			
			const {productId, deliveryOptionId} = option.dataset;
			const idToFind = deliveryOptionId;
			const matchingOption = deliveryOptions.find(option => option.id === idToFind);
			console.log(matchingOption);
			updateDeliveryOption(productId, deliveryOptionId);
			renderOrderSummary();
			renderPaymentSummary();
		})
	}) 
	
	document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;

        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.add('is-editing-quantity');
      });
    });

  document.querySelectorAll('.js-save-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;

        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.remove('is-editing-quantity');

        const quantityInput = document.querySelector(
          `.js-quantity-input-${productId}`
        );
        const newQuantity = Number(quantityInput.value);
        updateQuantity(productId, newQuantity);

        renderCheckoutHeader();
        renderOrderSummary();
        renderPaymentSummary();

        // We can delete the code below (from the original solution)
        // because instead of using the DOM to update the page directly
        // we can use MVC and re-render everything. This will make sure
        // the page always matches the data.

        // const quantityLabel = document.querySelector(
        //   `.js-quantity-label-${productId}`
        // );
        // quantityLabel.innerHTML = newQuantity;

        // updateCartQuantity();
      });
    });
}