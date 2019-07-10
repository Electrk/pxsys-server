const rfr = require ('rfr');

const PxSysSocketManager = rfr ('classes/PxSysSocketManager.js');
const PxSysColorset      = rfr ('classes/PxSysColorset.js');
const PxSysScreen        = rfr ('classes/PxSysScreen.js');
const EnumBag            = rfr ('classes/EnumBag.js');

const defaultCommandCodes = require ('./defaultCommandCodes.js');
const defaultErrorCodes   = require ('./defaultErrorCodes.js');

const { requiredArgsAssert } = rfr ('utility/miscellaneous.js');
const { instanceOfAssert }   = rfr ('utility/typeAssert.js');


class PxSys
{
	constructor ( objects = {} )
	{
		const { screen, colorset } = objects;

		requiredArgsAssert ({ screen, colorset });

		instanceOfAssert (screen, PxSysScreen, 'screen');
		instanceOfAssert (colorset, PxSysColorset, 'colorset');

		this.isDeleted  = false;

		this._server        = null;
		this._serverInfo    = null;
		this._screen        = screen;
		this._colorset      = colorset;
		this._socketManager = new PxSysSocketManager ();

		this._screenFields  = {};

		this._commandCodes  = new EnumBag (...defaultCommandCodes);
		this._errorCodes    = new EnumBag (...defaultErrorCodes);
	}

	delete ( onServerClose )
	{
		if ( this.isDeleted )
		{
			return;
		}

		this.destroyServer (onServerClose);
		this._serverInfo = null;

		this._socketManager.delete ();
		this._colorset.delete ();
		this._screen.delete ();

		delete this._screen;
		delete this._colorset;
		delete this._socketManager;
		delete this._screenFields;
		delete this._commandCodes;
		delete this._errorCodes;

		this.isDeleted = true;
	}

	log ( ...args )
	{
		this._logMessage ('log', ...args);
	}

	warn ( ...args )
	{
		this._logMessage ('warn', ...args);
	}

	error ( ...args )
	{
		this._logMessage ('error', ...args);
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

	onServer ( event, callback )
	{
		return this._server.on (event, callback);
	}

	offServer ( event, callback )
	{
		return this._server.off (event, callback);
	}

	onSocket ( event, callback )
	{
		return this._socketManager.on (event, callback);
	}

	offSocket ( event, callback )
	{
		return this._socketManager.off (event, callback);
	}

	// ------------------------------------------------


	_logMessage ( type = 'log', ...args )
	{
		if ( type !== 'log'  &&  type !== 'warn'  &&  type !== 'error' )
		{
			return;
		}

		const timestamp = new Date ().toLocaleString ();
		const message   = `<${timestamp}> [PxSys]`;

		console[type] (message, ...args);
	}
}

require ('./createDestroyServer.js')(PxSys);
require ('./sendSocketData.js')(PxSys);
require ('./screenData.js')(PxSys);
require ('./onData.js')(PxSys);
require ('./authentication.js')(PxSys);


module.exports = PxSys;
