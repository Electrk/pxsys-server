const rfr = require ('rfr');
const net = require ('net');
const has = require ('has-own-property-x');

const { Socket }         = net;
const { AssertionError } = require ('assert');

const { expect } = require ('chai');

const PxSysSocket = rfr ('classes/PxSysSocket.js');


describe ('PxSysSocket', function ()
{
	it (`should write data separated by tabs`, function ( done )
	{
		const tcpSocket = new Socket ();
		const pxSocket  = new PxSysSocket (tcpSocket);

		const dataToSend = ['CL_TEST', 'e', 5, 6, .921, -52.001];

		const server = net.createServer (socket =>
		{
			socket.on ('data', data =>
			{
				tcpSocket.end ();
				socket.end ();
				server.close ();

				expect (data.toString ()).to.equal (dataToSend.join ('\t') + '\r\n');

				done ();
			});
		});

		const onSocketConnected = function ( done )
		{
			pxSocket.sendCommand (...dataToSend);
		};

		server.listen (8787, '127.0.0.1', function ()
		{
			tcpSocket.connect (8787, '127.0.0.1', onSocketConnected);
		});
	});

	it (`should pass event handlers to its private Socket instance`, function ( done )
	{
		const tcpSocket = new Socket ();
		const pxSocket  = new PxSysSocket (tcpSocket);

		pxSocket.on ('eventTest', function ()
		{
			done ();
		});

		tcpSocket.emit ('eventTest');
	});
});
