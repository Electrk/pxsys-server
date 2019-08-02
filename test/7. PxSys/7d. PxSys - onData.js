const rfr = require ('rfr');

const { Socket }         = require ('net');
const { AssertionError } = require ('assert');
const { expect }         = require ('chai');

const PxSys         = rfr ('classes/PxSys/PxSys.js');
const PxSysColorset = rfr ('classes/PxSysColorset.js');
const PxSysScreen   = rfr ('classes/PxSysScreen.js');
const PxSysSocket   = rfr ('classes/PxSysSocket.js');

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

	it (`should give an error when client sends a packet with an unknown type`, function ( done )
	{
		const onClientData = ( clientSocket, data ) =>
		{
			const dataString  = data.toString ();
			const dataArray   = dataString.split ('\t');
			const packetType  = parseInt (dataArray[0]);
			const packetError = parseInt (dataArray[1]);

			if ( packetType === pxObject.getCommandCode ('SV_AUTH_RESPONSE') )
			{
				clientSocket.write ('200\tbbbbb\t555\r\n');
			}
			else
			{
				expect (packetType).to.equal (pxObject.getCommandCode ('CL_ERROR'));
				expect (packetError).to.equal (pxObject.getErrorCode ('CL_UNK_PACKET_TYPE'));

				return true;
			}
		};

		const onSocketConnected = clientSocket =>
		{
			const command = pxObject.getCommandCode ('CL_AUTH_INFO');
			const name    = 'App';
			const version = 1;
			const login   = 'l';

			clientSocket.write (`${[command, name, version, PXSYS_VERSION, login].join ('\t')}\r\n`);
		};

		serverTest (done, onSocketConnected, onClientData);
	});

	it (`custom packet handlers should work properly`, function ( done )
	{
		let handler1Done = false;
		let handler2Done = false;
		let handler3Done = false;

		const onSocketConnected = clientSocket =>
		{
			const customHandler1 = ( pxSocket, dataArray ) =>
			{
				expect (pxSocket).to.be.an.instanceof (PxSysSocket);
				expect (dataArray[0]).to.equal ('yeee');
				expect (dataArray.length).to.equal (1);

				handler1Done = true;

				if ( handler1Done  &&  handler2Done  &&  handler3Done )
				{
					pxObject.destroyServer ();
					clientSocket.end ();

					done ();
				}
			};

			const customHandler2 = ( pxSocket, dataArray ) =>
			{
				expect (pxSocket).to.be.an.instanceof (PxSysSocket);
				expect (parseFloat (dataArray[0])).to.equal (1.21);
				expect (parseInt (dataArray[1])).to.equal (-500000);
				expect (dataArray.length).to.equal (2);

				handler2Done = true;

				if ( handler1Done  &&  handler2Done  &&  handler3Done )
				{
					pxObject.destroyServer ();
					clientSocket.end ();

					done ();
				}
			};

			const customHandler3 = ( pxSocket, dataArray ) =>
			{
				
				expect (pxSocket).to.be.an.instanceof (PxSysSocket);
				expect (parseInt (dataArray[0])).to.equal (1234);
				expect (parseFloat (dataArray[1])).to.equal (-.023);
				expect (dataArray[2]).to.equal (':)');
				expect (dataArray.length).to.equal (3);

				handler3Done = true;

				if ( handler1Done  &&  handler2Done  &&  handler3Done )
				{
					pxObject.destroyServer ();
					clientSocket.end ();

					done ();
				}
			};

			pxObject.addPacketHandler ('CL_DO_SOMETHING', customHandler1);
			pxObject.addPacketHandler ('CL_DO_ANOTHER', customHandler2);
			pxObject.addPacketHandler ('CL_DO_ONE_MORE', customHandler3);

			const command = pxObject.getCommandCode ('CL_AUTH_INFO');
			const name    = 'App';
			const version = 1;
			const login   = 'l';

			clientSocket.write (`${[command, name, version, PXSYS_VERSION, login].join ('\t')}\r\n`);

			setTimeout (() =>
			{
				const customCmd = pxObject.getCommandCode ('CL_DO_SOMETHING');

				clientSocket.write (`${[customCmd, 'yeee'].join ('\t')}\r\n`);
			}, 20);

			setTimeout (() =>
			{
				const customCmd = pxObject.getCommandCode ('CL_DO_ANOTHER');

				clientSocket.write (`${[customCmd, 1.21, -500000].join ('\t')}\r\n`);
			}, 40);

			setTimeout (() =>
			{
				const customCmd = pxObject.getCommandCode ('CL_DO_ONE_MORE');

				clientSocket.write (`${[customCmd, 1234, -.023, ':)'].join ('\t')}\r\n`);
			}, 60);
		};

		serverTest (done, onSocketConnected);
	});
});
