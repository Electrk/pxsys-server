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
		const dataString = data.toString ().replace (/\r?\n|\r/g, '');
		const dataArray  = dataString.split ('\t');
		const packetType = dataArray[0];

		const handlers = this._packetHandlers;

		if ( !handlers.has (packetType) )
		{
			return;
		}

		// Remove packet type since we don't want to include it in the callback arguments
		dataArray.shift ();

		const handlerSet = handlers.get (packetType);

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

	PxSys.prototype.onPacket = function ( type, callback )
	{
		const handlers = this._packetHandlers;

		if ( !handlers.has (type) )
		{
			handlers.set (type, new Set ());
		}

		const handlerSet = handlers.get (type);
		handlerSet.add (callback);

		return callback;
	};

	PxSys.prototype.offPacket = function ( type, callback )
	{
		const handlers = this._packetHandlers;

		if ( !handlers.has (type) )
		{
			return callback;
		}

		const handlerSet = handlers.get (type);
		handlerSet.delete (callback);

		return callback;
	};
};
 