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

		rgba =
		{
			r: colorArr[0],
			g: colorArr[1],
			b: colorArr[2],
			a: colorArr[3],
		};
	}

	/* Let's do some checks to make sure the colors are actually numbers */

	if ( rgba.r === ''  ||  rgba.g === ''  ||  rgba.b === ''  ||  rgba.a === '' )
	{
		return null;
	}

	rgba.r *= 1;
	rgba.g *= 1;
	rgba.b *= 1;
	rgba.a *= 1;

	if ( isNaN (rgba.r)  ||  isNaN (rgba.g)  ||  isNaN (rgba.b)  ||  isNaN (rgba.a) )
	{
		return null;
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
	assert.notStrictEqual (convertToRGBAObject (color), null, 'Color must be RGBA!');
};


module.exports = { convertToRGBAObject, toRGBAString, colorAssert };
