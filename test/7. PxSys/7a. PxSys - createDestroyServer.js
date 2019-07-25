const rfr = require ('rfr');

const { Socket }         = require ('net');
const { AssertionError } = require ('assert');

const PxSys         = rfr ('classes/PxSys/PxSys.js');
const PxSysColorset = rfr ('classes/PxSysColorset.js');
const PxSysScreen   = rfr ('classes/PxSysScreen.js');

const { expect } = require ('chai');


describe ('PxSys - createDestroyServer', function ()
{
	const screen   = new PxSysScreen ({ width: 160, height: 120, defaultValues: { colorID: 0 } });
	const colorset = new PxSysColorset (64);
	const pxObject = new PxSys ({ screen, colorset });


	it (`should throw an error when attempting to start a server with no server info set`, function ()
	{
		expect (() => pxObject.createServer ()).to.throw (AssertionError);
		pxObject.setServerInfo ({ loginKey: 'l', adminKey: 'a', appName: 'App', appVersion: 1 });
	});

	it (`should call onStart/onEnd when server is created/destroyed respectively`, function ( done )
	{
		let onStartCalled = false;
		let onEndCalled   = false;

		const onStart = function ()
		{
			onStartCalled = true;
			pxObject.destroyServer ();
		}

		const onEnd = function ()
		{
			onEndCalled = true;

			if ( onStartCalled  &&  onEndCalled )
			{
				done ();
			}
		}

		pxObject.createServer ({ onStart, onEnd });
	});

	it (`should invoke callback when calling destroyServer()`, function ( done )
	{
		const onStart = function ()
		{
			pxObject.destroyServer (() => done ());
		};

		pxObject.createServer ({ onStart });
	});

	it (`should call onConnection/onDisconnection when a socket connects/disconnects respectively`, function ( done )
	{
		const tcpSocket = new Socket ();

		let onConnectCalled    = false;
		let onDisconnectCalled = false;

		const onStart = function ()
		{
			tcpSocket.connect (pxObject._server.port, pxObject._server.address);
		};

		const onConnection = function ( socket )
		{
			onConnectCalled = true;
			tcpSocket.end ();
		};

		const onDisconnection = function ()
		{
			onDisconnectCalled = true;
			pxObject.destroyServer ();

			if ( onConnectCalled  &&  onDisconnectCalled )
			{
				done ();
			}
		};

		pxObject.createServer ({ onStart, onConnection, onDisconnection });
	});
});
