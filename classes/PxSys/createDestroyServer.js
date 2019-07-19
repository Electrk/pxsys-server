const rfr = require ('rfr');

const PxSysServer     = rfr ('classes/PxSysServer.js');
const PxSysServerInfo = rfr ('classes/PxSysServerInfo/PxSysServerInfo.js');


module.exports = ( PxSys ) =>
{
	PxSys.prototype.setServerInfo = function ( info )
	{
		if ( this.isDeleted  ||  this._serverInfo !== null )
		{
			return;
		}

		this._serverInfo = new PxSysServerInfo (info);
	};

	PxSys.prototype.createServer = function ( config = {} )
	{
		if ( this.isDeleted  ||  this._server !== null )
		{
			return;
		}

		if ( this._serverInfo === null )
		{
			this.error ('Failure!  Please set the server info before attempting to create a server.');
			return;
		}

		const
		{ 
			port    = 23,
			address = '127.0.0.1', 

			onStart         = function () {},
			onEnd           = function () {},
			onConnection    = function () {},
			onDisconnection = function () {},
		} = config;


		const onServerStart = function ( ...args )
		{
			this.log (`Server created on ${address}:${port}`);
			onStart (...args);
		};

		const onServerEnd = function ( ...args )
		{
			this.log ('Server was shut down.');
			onEnd (...args);
		};

		const onNewConnection = function ( socket )
		{
			const pxObject = this;
			const pxSocket = this._socketManager.addSocket (socket);
			const onData   = this._onData.bind (this);

			pxSocket.on ('data', function ( data )
			{
				onData (pxSocket, data);
			});

			pxSocket.on ('close', function ( hadError )
			{
				pxObject.log (`Disconnected: ${socket.remoteAddress}:${socket.remotePort}`);
				onDisconnection (hadError);
			});

			pxSocket.on ('error', function ( socketError )
			{
				pxObject.error (`Socket Error: ${socketError}`);
			});

			this.log (`New connection: ${socket.remoteAddress}:${socket.remotePort}`);
			onConnection (socket, pxSocket);
		};

		const onError = function ( serverError )
		{
			this.error (`Server Error: ${serverError}`);
		};

		const serverArgs =
		{
			port,
			address,

			onServerStart: onServerStart.bind (this),
			onServerEnd:   onServerEnd.bind (this),
		};

		const server = new PxSysServer (serverArgs);

		server.on ('connection', onNewConnection.bind (this));
		server.on ('error', onError.bind (this));

		this._server = server;
	};

	PxSys.prototype.destroyServer = function ( callback )
	{
		if ( !this.isDeleted  &&  this._server !== null )
		{
			this._server.delete (callback);
			this._server = null;
		}
	};
};
