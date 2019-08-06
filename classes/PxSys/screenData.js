const rfr = require ('rfr');

const PxSysServer = rfr ('classes/PxSysServer.js');
const logger      = rfr ('utility/logger.js');


module.exports = PxSys =>
{
	PxSys.prototype.setScreenPixel = function ( x, y, key, value )
	{
		this._screen.setPixel (x, y, key, value);
	};

	PxSys.prototype.sendScreenData = function ()
	{
		const changed = this._screen.getChangedPixels ();
		const length  = changed.length;

		for ( let i = 0;  i < length;  i++ )
		{
			let pixel = changed[i];
			let x     = pixel[0];
			let y     = pixel[1];
			let key   = pixel[2];
			let value = pixel[3];

			this.sendSocketCommandToAll ('SV_PIXEL_DATA', x, y, key, value);
		}

		this._screen.clearChangedPixels ();
	};
};
