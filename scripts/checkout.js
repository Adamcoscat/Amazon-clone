import {cart, removeCartItem, updateDeliveryOption} from '../data/cart.js';
import {products} from '../data/products.js';
import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import dayjs from './dayjs+esm.js';
import {deliveryOptions} from '../data/deliveryOptions.js';
const date = dayjs();

let cartSummaryHTML;
cart.forEach(cartItem => {
	const productId = cartItem.productId;
	
	let matchingItem;
	
	products.forEach(product => {
		if (product.id === productId) {
			matchingItem = product;
		}
	})
	
	const deliveryOptionId = cartItem.deliveryOptionId;
	
	let deliveryOption;
	
	deliveryOptions.forEach(option => {
		if (deliveryOptionId === option.id) {
			deliveryOption = option ;
		}
	})
	

	
	const today = dayjs();
	const deliveryOptionDate = today.add(deliveryOption.deliveryDays, 'days');
	const dateString = deliveryOptionDate.format('dddd, MMMM D');
	
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
                  <span class="update-quantity-link link-primary">
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

function renderDeliveryOptions(matchingItem, cartItem) {
	
	let html = '';
	
	
	deliveryOptions.forEach(option => {
		const isChecked = option.id === cartItem.deliveryOptionId;
		const today = dayjs();
		const deliveryOptionDate = today.add(option.deliveryDays, 'days');
		const dateString = deliveryOptionDate.format('dddd, MMMM D');
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
			document.querySelector(`.js-cart-item-container-${productId}`).remove();
		})
	})
	
	 document.querySelectorAll('.delivery-option').forEach(option => {
		option.addEventListener('click', () => {
			
			const {productId, deliveryOptionId} = option.dataset;
			const idToFind = deliveryOptionId;
			const matchingOption = deliveryOptions.find(option => option.id === idToFind);
			console.log(matchingOption);
			const newDate = updateDeliveryOption(productId, deliveryOptionId);
			const today = dayjs();
			const deliveryOptionDate = today.add(matchingOption.deliveryDays, 'days');
			const dateString = deliveryOptionDate.format('dddd, MMMM D');
			document.querySelectorAll('.delivery-date').forEach(date => {
				const dateId = date.dataset.productId;
				
				if (dateId === productId) {
					date.innerHTML = `Delivery date: ${dateString}`;
				}
			})
			
			
		})
	}) 