const rfr = require ('rfr');
const net = require ('net');

const { Socket }         = net;
const { AssertionError } = require ('assert');

const { expect } = require ('chai');

const PxSysSocket        = rfr ('classes/PxSysSocket.js');
const PxSysSocketManager = rfr ('classes/PxSysSocketManager.js');


describe ('PxSysSocketManager', function ()
{
	it (`should create a PxSysSocket instance from a TCP object`, function ()
	{
		const manager  = new PxSysSocketManager ();
		const pxSocket = manager.addSocket (new Socket ());

		expect (pxSocket).to.be.an.instanceof (PxSysSocket);
	});

	it (`should add a PxSysSocket to its storage`, function ()
	{
		const manager  = new PxSysSocketManager ();
		const pxSocket = manager.addSocket (new Socket ());

		expect (manager._sockets.has (pxSocket)).to.be.true;
	});

	it (`should remove the PxSysSocket and "delete" it properly`, function ()
	{
		const manager  = new PxSysSocketManager ();
		const pxSocket = manager.addSocket (new Socket ());

		expect (manager._sockets.has (pxSocket)).to.be.true;

		manager.removeSocket (pxSocket);

		expect (manager._sockets.has (pxSocket)).to.be.false;
		expect (pxSocket).to.not.have.own.property ('_socket');
	});

	it (`should apply event listeners to existing and any later-added sockets`, function ( done )
	{
		const manager    = new PxSysSocketManager ();
		const numSockets = 10;

		let numEmits = 0;

		const onEventTest = function ()
		{
			numEmits++;

			if ( numEmits >= numSockets )
			{
				done ();
			}
		};

		for ( let i = 0;  i < numSockets / 2;  i++ )
		{
			manager.addSocket (new Socket ());
		}

		manager.on ('eventTest', onEventTest);

		for ( let i = 0;  i < numSockets / 2;  i++ )
		{
			manager.addSocket (new Socket ());
		}

		manager.forEach (pxSocket =>
		{
			pxSocket._socket.emit ('eventTest');
		});
	});

	it (`should make all sockets send the data when PxSysSocketManager::sendCommand is called`, function ( done )
	{
		const manager    = new PxSysSocketManager ();
		const dataToSend = ['CL_TEST', 'e', 5, 6, .921, -52.001];

		const numSockets = 10;
		let numEmits     = 0;

		const server = net.createServer (socket =>
		{
			socket.on ('data', data =>
			{
				expect (data.toString ()).to.equal (dataToSend.join ('\t') + '\r\n');

				numEmits++;

				if ( numEmits >= numSockets )
				{
					manager.delete ();
					socket.end ();
					server.close ();

					done ();
				}
			});
		});

		server.listen (8787, '127.0.0.1', function ()
		{
			for ( let i = 0;  i < numSockets;  i++ )
			{
				let tcpSocket = new Socket ();
				let pxSocket  = manager.addSocket (tcpSocket);

				tcpSocket.connect (8787, '127.0.0.1', function ()
				{
					if ( i === numSockets - 1 )
					{
						manager.sendCommand (...dataToSend);
					}
				});
			}
		});
	});
});
