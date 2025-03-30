import formatCurrency from '../scripts/utils/money.js';

function formatCurrencyTest(value, expectedResult, testCase) {
console.log(testCase);

	if (formatCurrency(value) === expectedResult) {
		console.log('passed');
	}else {
			console.log('failed');
		}
}

console.log('test suite: formatCurrency');
formatCurrencyTest(2095, '20.95', 'converts cents into dollars');

formatCurrencyTest(0, '0.00', 'works with 0');

formatCurrencyTest(2000.5, '20.01', 'rounds up numbers correctly');

formatCurrencyTest(2000.4 , '20.00', 'rounds numbers down correctly');