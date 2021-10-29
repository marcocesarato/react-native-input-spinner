/**
 * Is empty
 * @param x
 * @returns {boolean}
 */
export const isEmpty = (x) => {
	if (typeof x === typeof "") {
		x = x.replace(/\s/g, "");
		return x === "";
	}

	if (x===0) return false;
	if (!x) return true;
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
	let colors;
	const colorString = color.replace(/\s/g, "");
	if (
		(colors = /#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/.exec(
			colorString,
		))
	) {
		// #000000FF
		colors = [
			parseInt(colors[1], 16),
			parseInt(colors[2], 16),
			parseInt(colors[3], 16),
			parseInt(colors[4], 16),
		];
	} else if (
		(colors = /#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/.exec(
			colorString,
		))
	) {
		// #000000
		colors = [
			parseInt(colors[1], 16),
			parseInt(colors[2], 16),
			parseInt(colors[3], 16),
		];
	} else if (
		(colors = /#([\da-fA-F])([\da-fA-F])([\da-fA-F])/.exec(colorString))
	) {
		// #000
		colors = [
			parseInt(colors[1], 16) * 17,
			parseInt(colors[2], 16) * 17,
			parseInt(colors[3], 16) * 17,
		];
	} else if (
		(colors = /rgba\(([\d]+),([\d]+),([\d]+),([\d]+|[\d]*.[\d]+)\)/.exec(
			colorString,
		))
	) {
		// rgba(255,255,255,255)
		colors = [+colors[1], +colors[2], +colors[3], +colors[4]];
	} else if ((colors = /rgb\(([\d]+),([\d]+),([\d]+)\)/.exec(colorString))) {
		// rgb(255,255,255)
		colors = [+colors[1], +colors[2], +colors[3]];
	} else {
		colors = [0, 0, 0, 0];
	}

	// Add alpha if missing
	if (isNaN(colors[3])) {
		colors[3] = 255;
	}

	return colors;
};

/**
 * Parsed colors to hex code
 * @param colors
 * @returns {string}
 */
export const colorsToHex = (colors) => {
	const hexColors = colors.map((color) => {
		color = color.toString(16);
		while (color.length < 2) {
			color += "0";
		}
		return color;
	});

	return "#" + hexColors.join("");
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
	if (style == null) {
		style = defaultStyle;
	} else if (Array.isArray(style) && Array.isArray(defaultStyle)) {
		defaultStyle.concat(style);
		style = defaultStyle;
	} else if (Array.isArray(defaultStyle)) {
		defaultStyle.push(style);
		style = defaultStyle;
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
