const assert = require ('assert');
const has    = require ('has-own-property-x');

const { hasMulti, clampAssert } = require ('./miscellaneous.js');


const convertToRGBAObject = ( color ) =>
{
	if ( color === null  ||  typeof color === 'undefined' )
	{
		return null;
	}

	let rgba = color;

	if ( typeof color === 'string'  ||  Array.isArray (color) )
	{
		let colorArr = color;

		if ( typeof color === 'string' )
		{
			colorArr = color.split (' ');
		}

		if ( colorArr.length !== 4 )
		{
			return null;
		}

		rgba.r = colorArr[0];
		rgba.g = colorArr[1];
		rgba.b = colorArr[2];
		rgba.a = colorArr[3];
	}

	if ( !hasMulti (rgba, 'r', 'g', 'b', 'a') )
	{
		return null;
	}

	return rgba;
};

const toRGBAString = ( color ) =>
{
	const colorObj = convertToRGBAObject (color);

	if ( colorObj === null )
	{
		return '';
	}

	return `${colorObj.r} ${colorObj.g} ${colorObj.b} ${colorObj.a}`;
}

const colorAssert = ( color ) =>
{
	const colorObj = convertToRGBAObject (color);

	assert.notStrictEqual (colorObj, null, 'Color must be RGBA!');
};


module.exports = { convertToRGBAObject, toRGBAString, colorAssert };
