const net = require ('net');
const rfr = require ('rfr');

const logger = rfr ('utility/logger.js');

const { requiredArgsAssert } = rfr ('utility/miscellaneous.js');
const { instanceOfAssert }   = rfr ('utility/typeAssert.js');


class PxSysServer
{
	constructor ( port, address, onServerStart = function () {}, onServerEnd = function () {} )
	{
		requiredArgsAssert ({ port, address });

		const server = net.createServer ();

		this.isDeleted = false;
		this.port      = port;
		this.address   = address;
		this.sockets   = new Set ();

		this._onEnd  = onServerEnd;
		this._server = server.listen (port, address, onServerStart);
	}

	delete ( callback = function () {} )
	{
		if ( this.isDeleted )
		{
			return;
		}

		const closeCallback = function ( ...args )
		{
			this._onEnd (...args);
			callback (...args);

			for ( let socket of this.sockets )
			{
				socket.end ();
			}

			this.sockets.clear ();

			delete this.port;
			delete this.address;
			delete this.sockets;
			delete this._onEnd;
			delete this._server;

			this.isDeleted = true;
		};

		this._server.close (closeCallback.bind (this));
	}

	addSocket ( socket )
	{
		instanceOfAssert (socket, net.Socket, 'socket');
		this.sockets.add (socket);
	}

	removeSocket ( socket )
	{
		this.sockets.delete (socket);
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

		for ( let socket of this.sockets )
		{
			this.sendCommand (socket, command, ...args);
		}
	}

	on ( event, callback )
	{
		if ( !this.isDeleted )
		{
			return this._server.on (event, callback);
		}
	}

	off ( event, callback )
	{
		if ( !this.isDeleted )
		{
			return this._server.off (event, callback);
		}
	}
}


module.exports = PxSysServer;
