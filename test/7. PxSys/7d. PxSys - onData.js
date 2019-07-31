const rfr = require ('rfr');

const { Socket }         = require ('net');
const { AssertionError } = require ('assert');
const { expect }         = require ('chai');

const PxSys         = rfr ('classes/PxSys/PxSys.js');
const PxSysColorset = rfr ('classes/PxSysColorset.js');
const PxSysScreen   = rfr ('classes/PxSysScreen.js');

const { PXSYS_VERSION } = rfr ('miscellaneous/constants.js');


describe ('PxSys - onData', function ()
{
	const screen   = new PxSysScreen ({ width: 160, height: 120, defaultValues: { colorID: 0 } });
	const colorset = new PxSysColorset (64);
	const pxObject = new PxSys ({ screen, colorset });

	pxObject.setServerInfo ({ loginKey: 'l', adminKey: 'a', appName: 'App', appVersion: 1 });

	const serverTest = ( done, connectCB = () => {}, onClientData = () => {}, onServerData = () => {} ) =>
	{
		const clientSocket = new Socket ();

		clientSocket.on ('data', data =>
		{
			const result = onClientData (clientSocket, data);

			if ( typeof result === 'boolean' )
			{
				if ( result )
				{
					pxObject.destroyServer ();
					clientSocket.end ();

					done ();
				}
			}
			else if ( result instanceof Error )
			{
				pxObject.destroyServer ();
				clientSocket.end ();

				done (result);
			}
		});

		const onStart = () =>
		{
			const onSocketConnected = () =>
			{
				connectCB (clientSocket);
			};

			clientSocket.connect (pxObject._server.port, pxObject._server.address, onSocketConnected);
		};

		const onConnection = ( serverSocket, pxSocket ) =>
		{
			pxSocket.on ('data', data =>
			{
				onServerData (clientSocket, serverSocket, pxSocket, data);
			});
		};

		pxObject.createServer ({ onStart, onConnection });
	};

	it (`should give an error when missing a packet type`, function ( done )
	{
		let numTests = 0;
		let maxTests = 2;

		const onClientData = ( clientSocket, data ) =>
		{
			const dataString  = data.toString ();
			const dataArray   = dataString.split ('\t');
			const packetType  = parseInt (dataArray[0]);
			const packetError = parseInt (dataArray[1]);

			numTests++;

			if ( numTests >= maxTests )
			{
				return true;
			}

			expect (packetType).to.equal (pxObject.getCommandCode ('CL_ERROR'));
			expect (packetError).to.equal (pxObject.getErrorCode ('CL_MALFORMED_PACKET'));
		};

		const onSocketConnected = clientSocket =>
		{
			clientSocket.write ('asdasd\tbbbbb\t555\r\n');
			setTimeout (() => clientSocket.write ('\r\n'), 20);
		};

		serverTest (done, onSocketConnected, onClientData);
	});

	it (`should give an error when not authed`, function ( done )
	{
		let numTests = 0;
		let maxTests = 2;

		const onClientData = ( clientSocket, data ) =>
		{
			const dataString  = data.toString ();
			const dataArray   = dataString.split ('\t');
			const packetType  = parseInt (dataArray[0]);
			const packetError = parseInt (dataArray[1]);

			numTests++;

			if ( numTests === 1 )
			{
				expect (packetType).to.equal (pxObject.getCommandCode ('CL_ERROR'));
				expect (packetError).to.equal (pxObject.getErrorCode ('CL_NOT_AUTHED'));
			}
			else if ( numTests >= maxTests )
			{
				expect (packetType).to.not.equal (pxObject.getCommandCode ('CL_ERROR'));
				expect (packetError).to.not.equal (pxObject.getErrorCode ('CL_NOT_AUTHED'));

				return true;
			}
		};

		const onSocketConnected = clientSocket =>
		{
			clientSocket.write (`${pxObject.getCommandCode ('SV_COLORSET')}\r\n`);
			setTimeout (() => clientSocket.write (`${pxObject.getCommandCode ('CL_AUTH_INFO')}\r\n`), 20);
		};

		serverTest (done, onSocketConnected, onClientData);
	});
});
