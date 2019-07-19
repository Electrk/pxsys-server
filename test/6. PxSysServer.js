const rfr = require ('rfr');
const net = require ('net');

const { Socket }         = net;
const { AssertionError } = require ('assert');

const { expect } = require ('chai');

const PxSysServer = rfr ('classes/PxSysServer.js');


describe ('PxSysServer', function ()
{
	it (`should execute onServerStart when the server is started`, function ( done )
	{
		let server;

		const onServerStart = function ()
		{
			server.delete ();
			done ();
		};

		server = new PxSysServer ({ port: 23, address: '127.0.0.1', onServerStart });
	});

	it (`should execute onServerEnd when the server is ended`, function ( done )
	{
		let server;

		const onServerStart = function ()
		{
			server.delete ();
		};

		const onServerEnd = function ()
		{
			done ();
		};

		server = new PxSysServer ({ port: 23, address: '127.0.0.1', onServerStart, onServerEnd });
	});

	it (`should execute the callback when inputted as the delete() argument`, function ( done )
	{
		let server;

		const onServerStart = function ()
		{
			server.delete (function ()
			{
				done ();
			});
		};

		server = new PxSysServer ({ port: 23, address: '127.0.0.1', onServerStart });
	});
});