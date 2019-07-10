const rfr       = require ('rfr');
const cloneDeep = require ('clone-deep');
const deepEqual = require ('deep-equal');

const { pixelCoordsAssert, requiredArgsAssert } = rfr ('utility/miscellaneous.js');


class PxSysScreen
{
	constructor ( config = {} )
	{
		const { width, height, defaultValues } = config;
		requiredArgsAssert ({ width, height, defaultValues });

		const videoMemory = [];

		for ( let w = 0;  w < width;  w++ )
		{
			let col = [];

			for ( let h = 0;  h < height;  h++ )
			{
				col.push (cloneDeep (defaultValues));
			}

			videoMemory.push (col);
		}

		this.width  = width;
		this.height = height;

		this._defaultValues = defaultValues;
		this._videoMemory   = videoMemory;
		this._changedPixels = [];
	}

	delete ()
	{
		delete this.width;
		delete this.height;
		delete this._defaultValues;
		delete this._videoMemory;
		delete this._changedPixels;
	}

	getDefaultPixelValues ()
	{
		return cloneDeep (this._defaultValues);
	}

	getPixel ( x, y )
	{
		pixelCoordsAssert (x, y, this.width, this.height);

		return cloneDeep (this._videoMemory[x][y]);
	}

	setPixel ( x, y, key, value )
	{
		pixelCoordsAssert (x, y, this.width, this.height);

		const currentValues = this._videoMemory[x][y];

		if ( !deepEqual (currentValues[key], value) )
		{
			currentValues[key] = value;
			this._changedPixels.push ([x, y, key, value]);
		}
	}

	resetPixels ()
	{
		this.clearChangedPixels ();

		this.forEach (( x, y, pixel ) =>
		{
			this._videoMemory[x][y] = cloneDeep (this._defaultValues);
		});
	}

	getChangedPixels ()
	{
		return cloneDeep (this._changedPixels);
	}

	clearChangedPixels ()
	{
		this._changedPixels = [];
	}

	forEach ( callback )
	{
		const videoMemory = cloneDeep (this._videoMemory);
		const width       = this.width;
		const height      = this.height;

		for ( let x = 0;  x < width;  x++ )
		{
			for ( let y = 0;  y < height;  y++ )
			{
				callback (x, y, videoMemory[x][y]);
			}
		}
	}
}


module.exports = PxSysScreen;
