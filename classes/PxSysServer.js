const net = require ('net');
const rfr = require ('rfr');

const { requiredArgsAssert } = rfr ('utility/miscellaneous.js');
const { notNullAssert }      = rfr ('utility/typeAssert.js');


class PxSysServer
{
	constructor ( config = {} )
	{
		const
		{ 
			port,
			address,

			onServerStart = function () {},
			onServerEnd   = function () {},
		} = config;

		requiredArgsAssert ({ port, address });

		const server = net.createServer ();

		this.isDeleted = false;
		this.port      = port;
		this.address   = address;

		this._onEnd   = onServerEnd;
		this._server  = server.listen (port, address, onServerStart);
	}

	delete ( callback = function () {} )
	{
		if ( this.isDeleted )
		{
			return;
		}

		const closeCallback = function ( ...args )
		{
			callback (...args);

			delete this.port;
			delete this.address;
			delete this._onEnd;
			delete this._server;

			this.isDeleted = true;
		};

		this._close (closeCallback.bind (this));
	}

	on ( event, callback )
	{
		this._server.on (event, callback);
	}

	_close ( callback )
	{
		const closeCallback = function ( ...args )
		{
			this._onEnd (...args);
			callback (...args);
		};

		this._server.close (closeCallback.bind (this));
	}
}


module.exports = PxSysServer;
