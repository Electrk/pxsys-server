const rfr       = require ('rfr');
const cloneDeep = require ('clone-deep');

const { minAssert, clampAssert } = rfr ('utility/mathAssert.js');
const { integerTypeAssert }      = rfr ('utility/typeAssert.js');

const { toRGBAString, colorAssert } = rfr ('utility/colors.js');


class PxSysColorset
{
	constructor ( maxColors = 64 )
	{
		integerTypeAssert (maxColors, 'maxColors');
		minAssert (maxColors, 1, 'maxColors');

		const colors    = [];
		const colorToID = new Map ();

		// Fill with default placeholder colors

		for ( let i = 0;  i < maxColors;  i++ )
		{
			colors.push ('1.0 0.0 1.0 0.0');
		}

		this.isDeleted = false;

		this._colors    = colors;
		this._colorToID = colorToID;
	}

	delete ()
	{
		if ( this.isDeleted )
		{
			return;
		}

		this._colorToID.clear ();

		delete this._colors;
		delete this._colorToID;

		this.isDeleted = true;
	}

	forEach ( callback )
	{
		const colors = cloneDeep (this._colors);
		const length = colors.length;

		for ( let i = 0;  i < length; i++ )
		{
			callback (color[i], i, colors);
		}
	}

	setColor ( colorID, color )
	{
		integerTypeAssert (colorID, 'colorID');
		clampAssert (colorID, 0, this.getMaxColorID (), 'Color ID');
		colorAssert (color);

		const colorStr    = toRGBAString (color);
		const oldColorStr = toRGBAString (this._colors[colorID]);

		this._colorToID.delete (oldColorStr);
		this._colorToID.set (colorStr, colorID);

		this._colors[colorID] = colorStr;
	}

	getColor ( colorID )
	{
		return cloneDeep (this._colors[colorID]);
	}

	getColorID ( color )
	{
		return this._colorToID.get (toRGBAString (color));
	}

	getColorString ( colorID )
	{
		return toRGBAString (this._colors[colorID]);
	}

	getMaxColorID ()
	{
		return this._colors.length - 1;
	}
}


module.exports = PxSysColorset;
