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
	}

	delete ( onServerClose )
	{
		if ( this.isDeleted )
		{
			return;
		}

		this._screen.delete ();
		this._server.delete (onServerClose);

		this._server = null;

		delete this._screen;

		this.isDeleted = true;
	}

	sendSocketCommand ( socket, command, ...args )
	{
		this._server.sendCommand (socket, command, ...args);
	}

	sendSocketError ( socket, errorCommand, errorCode, errorMessage )
	{
		this.sendSocketCommand (socket, errorCommand, errorCode, errorMessage);
	}

	sendSocketCommandToAll ( command, ...args )
	{
		const pxObject = this;

		this._server.forEach (socket =>
		{
			pxObject.sendSocketCommand (socket, command, ...args);
		});
	}

	sendSocketErrorToAll ( errorCommand, errorCode, errorMessage )
	{
		const pxObject = this;

		this._server.forEach (socket =>
		{
			pxObject.sendSocketError (socket, errorCommand, errorMessage);
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
require ('./screenData.js')(PxSys);


module.exports = PxSys;
