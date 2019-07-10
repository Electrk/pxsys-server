const rfr = require ('rfr');
const { requiredArgsAssert } = rfr ('utility/miscellaneous.js');


module.exports = ( PxSys ) =>
{
	PxSys.prototype.addScreenField = function ( fieldName, defaultValue, commandString )
	{
		requiredArgsAssert ({ fieldName, defaultValue, commandString });

		this._commandCodes.add (commandString);
		this._screenFields[fieldName] = { defaultValue, commandString };
	};

	PxSys.prototype.getFieldCommandString = function ( fieldName )
	{
		return this._screenFields[fieldName].commandString;
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
			let field = pixel[2];
			let value = pixel[3];

			this.sendCommandToAll (this.getFieldCommandString (field), x, y, value);
		}

		this._screen.clearChangedPixels ();
	};
};
