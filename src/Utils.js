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
 * Parse color.
 * @param color
 * @returns {number[]}
 */
export const parseColor = (color) => {
	let cache;
	let p = parseInt;
	color = color.replace(/\s/g, "");
	if (
		(cache = /#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/.exec(
			color,
		))
	) {
		// #000000FF
		cache = [
			p(cache[1], 16),
			p(cache[2], 16),
			p(cache[3], 16),
			p(cache[4], 16),
		];
	} else if (
		(cache = /#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/.exec(color))
	) {
		// #000000
		cache = [p(cache[1], 16), p(cache[2], 16), p(cache[3], 16)];
	} else if ((cache = /#([\da-fA-F])([\da-fA-F])([\da-fA-F])/.exec(color))) {
		cache = [p(cache[1], 16) * 17, p(cache[2], 16) * 17, p(cache[3], 16) * 17];
	} else if (
		// #000
		(cache = /rgba\(([\d]+),([\d]+),([\d]+),([\d]+|[\d]*.[\d]+)\)/.exec(color))
	) {
		// rgba(255,255,255,255)
		cache = [+cache[1], +cache[2], +cache[3], +cache[4]];
	} else if ((cache = /rgb\(([\d]+),([\d]+),([\d]+)\)/.exec(color))) {
		// rgb(255,255,255)
		cache = [+cache[1], +cache[2], +cache[3]];
	} else {
		cache = [0, 0, 0, 0];
	}
	isNaN(cache[3]) && (cache[3] = 1);
	return cache.slice(0, 4);
};

/**
 * Is transparent color
 * @private
 * @param color
 * @returns {boolean}
 */
export const isTransparentColor = (color) => {
	color = String(color).toLowerCase().trim();
	const parse = parseColor(color);
	return String(color).toLowerCase().trim() === "transparent" || parse[4] === 0;
};

/**
 * Is variable callable
 * @private
 * @param callback
 * @returns {boolean}
 */
export const isCallable = (callback) => {
	return (
		callback != null &&
		(callback instanceof Function || typeof callback === "function")
	);
};

/**
 * Debounce
 * @param callback
 * @param wait
 * @returns {function(...[*]=): void}
 */
export const debounce = (callback, wait) => {
	let timeout;
	return function (...args) {
		const context = this;
		clearTimeout(timeout);
		timeout = setTimeout(() => callback.apply(context, args), wait);
		return timeout;
	};
};

/**
 * Detect if is a numeric value
 * @param num
 * @returns {boolean}
 */
export const isNumeric = (num) => {
	return (
		num != null &&
		num !== false &&
		num !== "" &&
		!isNaN(parseFloat(num)) &&
		!isNaN(num - 0)
	);
};

/**
 * Merge styles
 * @param style
 * @param defaultStyle
 * @returns {*[]}
 */
export const mergeViewStyle = (style, defaultStyle) => {
	if (Array.isArray(style) && Array.isArray(defaultStyle)) {
		defaultStyle.concat(style);
	} else if (Array.isArray(style)) {
		style.unshift(defaultStyle);
	} else {
		style = [defaultStyle, style];
	}
	return style;
};

/**
 * Get color contrast
 * @param hexcolor
 * @returns {string}
 */
export const getColorContrast = (hexcolor) => {
	if (hexcolor.slice(0, 1) === "#") {
		hexcolor = hexcolor.slice(1);
	}
	if (hexcolor.length === 3) {
		hexcolor = hexcolor
			.split("")
			.map(function (hex) {
				return hex + hex;
			})
			.join("");
	}
	var r = parseInt(hexcolor.substr(0, 2), 16);
	var g = parseInt(hexcolor.substr(2, 2), 16);
	var b = parseInt(hexcolor.substr(4, 2), 16);
	var yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 170 ? "#000000" : "#FFFFFF";
};
