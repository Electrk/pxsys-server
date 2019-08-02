const rfr       = require ('rfr');
const cloneDeep = require ('clone-deep');
const deepEqual = require ('deep-equal');

const { requiredArgsAssert } = rfr ('utility/miscellaneous.js');
const { stringTypeAssert }   = rfr ('utility/typeAssert.js');
const { clampAssert }        = rfr ('utility/mathAssert.js');


class PxSysScreen
{
	constructor ( width, height, defaultValues )
	{
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

		this.isDeleted = false;
		this.width     = width;
		this.height    = height;

		this._defaultValues = defaultValues;
		this._videoMemory   = videoMemory;
		this._changedPixels = [];
	}

	delete ()
	{
		if ( this.isDeleted )
		{
			return;
		}

		delete this.width;
		delete this.height;
		delete this._defaultValues;
		delete this._videoMemory;
		delete this._changedPixels;

		this.isDeleted = true;
	}

	getDefaultPixelValues ()
	{
		return cloneDeep (this._defaultValues);
	}

	getPixel ( x, y )
	{
		return cloneDeep (this._videoMemory[x][y]);
	}

	setPixel ( x, y, key, value )
	{
		clampAssert (x, 0, this.width - 1, 'x');
		clampAssert (y, 0, this.height - 1, 'y');

		stringTypeAssert (key, 'key');

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

		this.forEach (( pixel, x, y ) =>
		{
			this._videoMemory[x][y] = cloneDeep (this._defaultValues);
		});
	}

	getChangedPixels ()
	{
		return this._changedPixels;
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
				callback (videoMemory[x][y], x, y);
			}
		}
	}
}


module.exports = PxSysScreen;
