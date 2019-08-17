const rfr = require ('rfr');

const PxSysScreen = rfr ('classes/PxSysScreen.js');

const { requiredArgsAssert } = rfr ('utility/miscellaneous.js');
const { instanceOfAssert }   = rfr ('utility/typeAssert.js');


class PxSys
{
	constructor ( screen )
	{
		requiredArgsAssert ({ screen });
		instanceOfAssert (screen, PxSysScreen, 'screen');

		this.isDeleted = false;

		this._server = null;
		this._screen = screen;

		this._packetHandlers = new Map ();
	}

	delete ( onServerClose )
	{
		if ( this.isDeleted )
		{
			return;
		}

		this._screen.delete ();
		this._server.delete (onServerClose);

		for ( let [packetCommand, handlerSet] of this._packetHandlers )
		{
			handlerSet.clear ();
		}

		this._packetHandlers.clear ();

		this._server = null;

		delete this._screen;
		delete this._packetHandlers;

		this.isDeleted = true;
	}

	sendCommand ( socket, command, ...args )
	{
		this._server.sendCommand (socket, command, ...args);
	}

	sendError ( socket, errorCommand, errorCode, errorMessage, data )
	{
		this.sendCommand (socket, errorCommand, errorCode, errorMessage, data);
	}

	sendCommandToAll ( command, ...args )
	{
		const pxObject = this;

		this._server.forEach (socket =>
		{
			pxObject.sendCommand (socket, command, ...args);
		});
	}

	sendErrorToAll ( errorCommand, errorCode, errorMessage, data )
	{
		const pxObject = this;

		this._server.forEach (socket =>
		{
			pxObject.sendError (socket, errorCommand, errorMessage, data);
		});
	}

	onServer ( event, callback )
	{
		return this._server.on (event, callback);
	}

	offServer ( event, callback )
	{
		return this._server.off (event, callback);
	}
}

require ('./createDestroyServer.js')(PxSys);
require ('./handleSockets.js')(PxSys);
require ('./screenData.js')(PxSys);


module.exports = PxSys;
