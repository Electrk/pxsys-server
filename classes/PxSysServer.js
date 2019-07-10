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
			onServerStart,

			onServerEnd = function () {},
		} = config;

		requiredArgsAssert ({ port, address, onServerStart });

		const server = net.createServer ();

		this._onEnd  = onServerEnd;
		this._server = server.listen (port, address, onServerStart);
	}

	delete ( callback )
	{
		this._close (callback);

		delete this._onEnd;
		delete this._server;
	}

	on ( event, callback )
	{
		this._server.on (event, callback);
	}

	_close ( callback )
	{
		const closeCallback = ( ...args ) =>
		{
			this._onEnd (...args);

			callback (...args);
		};

		this._server.close (closeCallback);
	}
}


module.exports = PxSysServer;
