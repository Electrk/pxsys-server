const net = require ('net');
const rfr = require ('rfr');

const logger = rfr ('utility/logger.js');

const { requiredArgsAssert } = rfr ('utility/miscellaneous.js');
const { instanceOfAssert }   = rfr ('utility/typeAssert.js');


class PxSysServer
{
	constructor ( port, address, onServerStart = () => {}, onServerEnd = () => {} )
	{
		requiredArgsAssert ({ port, address });

		const server = net.createServer ();

		this.isDeleted = false;
		this.port      = port;
		this.address   = address;

		this._sockets = new Set ();
		this._onEnd   = onServerEnd;
		this._server  = server.listen (port, address, onServerStart);
	}

	delete ( callback = function () {} )
	{
		if ( this.isDeleted )
		{
			return;
		}

		const closeCallback = function ()
		{
			callback ();
			this._onEnd ();

			for ( let socket of this._sockets )
			{
				socket.end ();
			}

			this._sockets.clear ();

			delete this.port;
			delete this.address;
			delete this._sockets;
			delete this._onEnd;
			delete this._server;

			this.isDeleted = true;
		};

		this._server.close (closeCallback.bind (this));
	}

	addSocket ( socket )
	{
		instanceOfAssert (socket, net.Socket, 'socket');
		this._sockets.add (socket);
	}

	removeSocket ( socket )
	{
		this._sockets.delete (socket);
	}

	sendCommand ( socket, command, ...args )
	{
		if ( !this.isDeleted )
		{
			socket.write (`${command}\t${args.join ('\t')}\r\n`);
		}
	}

	sendCommandToAll ( command, ...args )
	{
		if ( this.isDeleted )
		{
			return;
		}

		for ( let socket of this._sockets )
		{
			this.sendCommand (socket, command, ...args);
		}
	}

	forEach ( callback )
	{
		for ( let socket = this._sockets )
		{
			callback (socket);
		}
	}

	on ( event, callback )
	{
		return this._server.on (event, callback);
	}

	off ( event, callback )
	{
		return this._server.off (event, callback);
	}
}


module.exports = PxSysServer;
