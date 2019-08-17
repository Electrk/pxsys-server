const rfr    = require ('rfr');
const logger = rfr ('utility/logger.js');


module.exports = PxSys =>
{
	PxSys.prototype._onConnection = function ( socket, server )
	{
		server.addSocket (socket);

		this._onSocket (socket, 'close', function ()
		{
			server.removeSocket (socket);
		});

		this._onSocket (socket, 'error', function ( error )
		{
			logger.log (`Socket error: ${error}`);
		});

		this._onSocket (socket, 'data', function ( data )
		{
			this._onData (socket, data);
		});

		logger.log (`New connection: ${socket.remoteAddress}:${socket.remotePort}`);
	};

	PxSys.prototype._onData = function ( socket, data )
	{
		const dataString    = data.toString ().replace (/\r?\n|\r/g, '');
		const dataArray     = dataString.split ('\t');
		const packetCommand = dataArray[0];

		const handlers = this._packetHandlers;

		if ( !handlers.has (packetCommand) )
		{
			return;
		}

		// Remove packet command since we don't want to include it in the callback arguments.
		dataArray.shift ();

		const handlerSet = handlers.get (packetCommand);

		for ( let callback of handlerSet )
		{
			callback (socket, ...dataArray);
		}
	};

	PxSys.prototype._onSocket = function  ( socket, event, callback )
	{
		return socket.on (event, callback.bind (this));
	};

	PxSys.prototype._offSocket = function  ( socket, event, callback )
	{
		return socket.off (event, callback);
	};

	PxSys.prototype.onPacket = function ( packetCommand, callback )
	{
		const handlers = this._packetHandlers;

		if ( !handlers.has (packetCommand) )
		{
			handlers.set (packetCommand, new Set ());
		}

		const handlerSet = handlers.get (packetCommand);
		handlerSet.add (callback);

		return callback;
	};

	PxSys.prototype.offPacket = function ( packetCommand, callback )
	{
		const handlers = this._packetHandlers;

		if ( !handlers.has (packetCommand) )
		{
			return callback;
		}

		const handlerSet = handlers.get (packetCommand);
		handlerSet.delete (callback);

		return callback;
	};
};
 