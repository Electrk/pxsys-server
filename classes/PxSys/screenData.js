const rfr = require ('rfr');

const PxSysServer = rfr ('classes/PxSysServer.js');
const logger      = rfr ('utility/logger.js');


module.exports = PxSys =>
{
	PxSys.prototype.sendScreenData = function ( socket = null )
	{
		const screen = this._screen;

		if ( socket === null )
		{
			this.sendSocketCommandToAll ('SV_SCREEN_SIZE', screen.width, screen.height);
		}
		else
		{
			this.sendSocketCommand (socket, 'SV_SCREEN_SIZE', screen.width, screen.height);
		}
	}

	PxSys.prototype.setScreenPixel = function ( x, y, key, value )
	{
		this._screen.setPixel (x, y, key, value);
	};

	PxSys.prototype.sendChangedPixels = function ( socket = null )
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

			if ( socket === null )
			{
				this.sendSocketCommandToAll ('SV_PIXEL_DATA', x, y, key, value);
			}
			else
			{
				this.sendSocketCommand (socket, 'SV_PIXEL_DATA', x, y, key, value);
			}
		}

		this._screen.clearChangedPixels ();
	};

	PxSys.prototype.sendPixelData = function ( socket = null )
	{
		this._screen.forEach (( pixelData, x, y ) =>
		{
			for ( let i in pixelData )
			{
				if ( socket === null )
				{
					this.sendSocketCommandToAll ('SV_PIXEL_DATA', x, y, i, pixelData[i]);
				}
				else
				{
					this.sendSocketCommand (socket, 'SV_PIXEL_DATA', x, y, i, pixelData[i]);
				}
			}
		});
	};
};
