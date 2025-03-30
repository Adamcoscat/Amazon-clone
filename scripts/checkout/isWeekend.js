export default function isWeekend(date) {
	const day = date.format('dddd');
	if (day === 'Saturday' || day === 'Sunday') {
		console.log(day);
	} else {
		console.log('not weekend');
	}
}