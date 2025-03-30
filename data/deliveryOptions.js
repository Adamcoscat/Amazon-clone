import dayjs from '../scripts/dayjs+esm.js';
import isWeekend from '../scripts/checkout/isWeekend.js';

export const deliveryOptions = [{
	id: '1',
	deliveryDays: 7,
	priceCents: 0
}, {
	id: '2',
	deliveryDays: 3,
	priceCents: 499
}, {
	id: '3',
	deliveryDays: 1,
	priceCents: 999
}];

export function getDeliveryOption(deliveryOptionId) {
	let deliveryOption;
	
		deliveryOptions.forEach(option => {
		if (deliveryOptionId === option.id) {
			deliveryOption = option ;
		}
	})
	
	return deliveryOption || deliveryOptions[0];
}
export function calcDeliveryDate(deliveryOption) {
	
	let remainingDays = deliveryOption.deliveryDays;
	let date = dayjs()
	
	while (remainingDays  > 0) {
		date = date.add(1, 'days');
		
		if (!isWeekend(date)) {
			remainingDays--;
		}
	}
	
	const dateString = date.format('dddd, MMMM D');
	return dateString;
} 