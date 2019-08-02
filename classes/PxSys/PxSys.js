const rfr = require ('rfr');

const PxSysScreen        = rfr ('classes/PxSysScreen.js');
const EnumBag            = rfr ('classes/EnumBag.js');

const defaultCommandCodes   = require ('./defaultCommandCodes.js');
const defaultErrorCodes     = require ('./defaultErrorCodes.js');

const { requiredArgsAssert } = rfr ('utility/miscellaneous.js');
const { instanceOfAssert }   = rfr ('utility/typeAssert.js');


class PxSys
{
	constructor ( objects = {} )
	{
		const { screen } = objects;

		requiredArgsAssert ({ screen });
		instanceOfAssert (screen, PxSysScreen, 'screen');

		this.isDeleted = false;

		this._server        = null;
		this._screen        = screen;
		this._socketManager = new PxSysSocketManager ();

		this._commandCodes = new EnumBag (...defaultCommandCodes);
		this._errorCodes   = new EnumBag (...defaultErrorCodes);
	}

	delete ( onServerClose )
	{
		if ( this.isDeleted )
		{
			return;
		}

		this._screen.delete ();

		delete this._screen;
		delete this._commandCodes;
		delete this._errorCodes;

		this.isDeleted = true;
	}

	addCommand ( commandString )
	{
		if ( !this._commandCodes.has (commandString) )
		{
			this._commandCodes.add (commandString);
		}

		return this._commandCodes.get (commandString);
	}

	addError ( errorString )
	{
		if ( !this._errorCodes.has (errorString) )
		{
			this._errorCodes.add (errorString);
		}

		return this._errorCodes.get (errorString);
	}

	getCommandCode ( name )
	{
		return this._commandCodes.get (name);
	}

	getErrorCode ( name )
	{
		return this._errorCodes.get (name);
	}

	getCommandString ( code )
	{
		return this._commandCodes.getName (code);
	}

	getErrorString ( code )
	{
		return this._errorCodes.getName (code);
	}
}


module.exports = PxSys;
