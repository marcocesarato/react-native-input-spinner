/**
 * Is string empty
 * @param str
 * @returns {boolean|boolean}
 */
export const isStringEmpty = (str) => {
	return String(str) === "";
};

/**
 * Is empty
 * @param x
 * @returns {boolean}
 */
export const isEmpty = (x) => {
	if (typeof x === typeof "") x = x.replace(/\s/g, "");

	if (!x) return true;
	if (x === "") return true;
	if (x === {}) return true;
	if (x === []) return true;
	if (x == null) return true;
	if (typeof x === "undefined") return true;
	if (x === "") return true;
	if (x === function () {}) return true;

	if (typeof x === typeof {}) {
		if (Object.entries(x).length === 0 && x.constructor === Object) {
			return true;
		}
		for (let key in x) {
			if (x.hasOwnProperty(key) && !isEmpty(x[key])) {
				return false;
			}
		}
		return true;
	}
	return false;
};

/**
 * Debounce
 * @param callback
 * @param wait
 * @param context
 * @returns {function(...[*]=): void}
 */
export const debounce = (callback, wait, context = null) => {
	let timeout;
	return (...args) => {
		if (context === null) {
			context = this;
		}
		clearTimeout(timeout);
		timeout = setTimeout(() => callback.apply(context, args), wait);
	};
};

/**
 * Detect if is a numeric value
 * @param num
 * @returns {boolean}
 */
export const isNumeric = (num) => {
	return (
		num !== "" &&
		num !== null &&
		num !== false &&
		!isNaN(parseFloat(num)) &&
		!isNaN(num - 0)
	);
};
