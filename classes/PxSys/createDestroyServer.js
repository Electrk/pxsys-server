const rfr = require ('rfr');

const PxSysServer = rfr ('classes/PxSysServer.js');
const logger      = rfr ('utility/logger.js');


module.exports = PxSys =>
{
	PxSys.prototype.createServer = function ( port = 23, address = '127.0.0.1', callbacks = {} )
	{
		if ( this.isDeleted  ||  this._server !== null )
		{
			return;
		}

		const
		{
			onStart = function () {},
			onEnd   = function () {},
		} = callbacks;

		const onServerStart = function ( socket )
		{
			onStart (socket);
			logger.log (`TCP server started on ${address}:${port}`);
		};

		const onServerEnd = function ( hadError )
		{
			onEnd (hadError);
			logger.log ('TCP server closed' + (hadError ? ' with error!' : '.'));
		};

		const server = new PxSysServer (port, address, onServerStart, onServerEnd);

		server.on ('connection', socket =>
		{
			server.addSocket (socket);
			socket.on ('close', () => server.removeSocket (socket));
			socket.on ('error', error => logger.log (`Socket error: ${error}`));

			logger.log (`New connection: ${socket.remoteAddress}:${socket.remotePort}`);
		});

		server.on ('error', serverError =>
		{
			logger.error (`Server Error: ${serverError}`);
		});

		this._server = server;
	};

	PxSys.prototype.destroyServer = function ( callback )
	{
		if ( this.isDeleted  ||  this._server === null )
		{
			return;
		}

		this._server.delete (callback);
		this._server = null;
	};
};
