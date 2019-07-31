const rfr = require ('rfr');

const { Socket }         = require ('net');
const { AssertionError } = require ('assert');
const { expect }         = require ('chai');

const PxSys         = rfr ('classes/PxSys/PxSys.js');
const PxSysColorset = rfr ('classes/PxSysColorset.js');
const PxSysScreen   = rfr ('classes/PxSysScreen.js');

const { PXSYS_VERSION } = rfr ('miscellaneous/constants.js');


describe ('PxSys - authentication', function ()
{
	const screen   = new PxSysScreen ({ width: 160, height: 120, defaultValues: { colorID: 0 } });
	const colorset = new PxSysColorset (64);
	const pxObject = new PxSys ({ screen, colorset });

	pxObject.setServerInfo ({ loginKey: 'l', adminKey: 'a', appName: 'App', appVersion: 1 });

	it (`should refuse any non-auth packets when socket is not authed`, function ( done )
	{
		const tcpSocket = new Socket ();

		const onStart = socket =>
		{
			tcpSocket.connect (pxObject._server.port, pxObject._server.address, () => tcpSocket.write (`15\r\n`));
		};

		tcpSocket.on ('data', data =>
		{
			const dataString = data.toString ();
			const dataArray  = dataString.split ('\t');

			const testCommand  = pxObject.getCommandCode ('CL_ERROR');
			const testArgument = pxObject.getErrorCode ('CL_NOT_AUTHED');

			pxObject.destroyServer ();
			tcpSocket.end ();

			expect (dataString).to.equal (`${testCommand}\t${testArgument}\r\n`);
			done ();
		});

		pxObject.createServer ({ onStart });
	});

	it (`should send a proper auth response`, function ( done )
	{
		const tcpSocket = new Socket ();

		const onStart = socket =>
		{
			const command = pxObject.getCommandCode ('CL_AUTH_INFO');
			const name    = 'App';
			const version = 1;
			const login   = 'l';

			const port    = pxObject._server.port;
			const address = pxObject._server.address;

			tcpSocket.connect (port, address, () =>
			{
				tcpSocket.write (`${[command, name, version, PXSYS_VERSION, login].join ('\t')}\r\n`);

				setTimeout (() =>
				{
					tcpSocket.write (`${[command, name, version, PXSYS_VERSION, login, 'a'].join ('\t')}\r\n`);
				}, 20);

				setTimeout (() =>
				{
					tcpSocket.write (`${[command, name, PXSYS_VERSION].join ('\t')}\r\n`);
				}, 40);

				setTimeout (() =>
				{
					tcpSocket.write (`${[command, name, version, PXSYS_VERSION, 'hhhh'].join ('\t')}\r\n`);
				}, 60);

				setTimeout (() =>
				{
					tcpSocket.write (`${[command, name, version, PXSYS_VERSION, 'gggg', 'bds'].join ('\t')}\r\n`);
				}, 80);
			});
		};

		const maxPackets = 5;
		let numPackets   = 0;

		tcpSocket.on ('data', data =>
		{
			const dataString = data.toString ();
			const dataArray  = dataString.split ('\t');

			const testCommand = pxObject.getCommandCode ('SV_AUTH_RESPONSE');

			numPackets++;

			if ( numPackets >= maxPackets )
			{
				pxObject.destroyServer ();
				tcpSocket.end ();
			}

			let expectString = `${testCommand}\t1\t0`;

			if ( numPackets === 2 )
			{
				expectString = `${testCommand}\t1\t1`;
			}
			else if ( numPackets === 3 )
			{
				const errorCode = pxObject._serverInfo._errorCodes.get ('CL_MISSING_INFO');
				const errorMsg  = 'Missing required fields: `pxSysVersion`, `loginKey`';

				expectString = `${testCommand}\t0\t${errorCode}\t${errorMsg}`;
			}
			else if ( numPackets === 4 )
			{
				const errorCode = pxObject._serverInfo._errorCodes.get ('CL_BAD_LOGIN');
				const errorMsg  = pxObject._serverInfo._errorMessages.CL_BAD_LOGIN;

				expectString = `${testCommand}\t0\t${errorCode}\t${errorMsg}`;
			}
			else if ( numPackets === 5 )
			{
				const errorCodes = pxObject._serverInfo._errorCodes;
				const errorMsgs  = pxObject._serverInfo._errorMessages;

				const errors = [];

				errors.push (errorCodes.get ('CL_BAD_LOGIN'), errorMsgs.CL_BAD_LOGIN);
				errors.push (errorCodes.get ('CL_BAD_ADMIN'), errorMsgs.CL_BAD_ADMIN);

				expectString = `${testCommand}\t0\t${errors.join ('\t')}`;
			}

			expect (dataString).to.equal (`${expectString}\r\n`);

			if ( numPackets >= maxPackets )
			{
				done ();
			}
		});

		pxObject.createServer ({ onStart });
	});

	it (`should set isAuthed to true when socket is authed and vice versa for not authed`, function ( done )
	{
		const tcpSocket = new Socket ();

		let numAuthAttempts = 0;
		let maxAuthAttempts = 3;

		const onStart = () =>
		{
			const onSocketConnected = () =>
			{
				const command = pxObject.getCommandCode ('CL_AUTH_INFO');
				const name    = 'App';
				const version = 1;
				const login   = 'l';

				tcpSocket.write (`${command}\r\n`);

				setTimeout (() =>
				{
					tcpSocket.write (`${[command, name, version, PXSYS_VERSION, login].join ('\t')}\r\n`);
				}, 20);

				setTimeout (() =>
				{
					tcpSocket.write (`${[command, name, version, Math.random (), Math.random ()].join ('\t')}\r\n`);
				}, 40);
			};

			tcpSocket.connect (pxObject._server.port, pxObject._server.address, onSocketConnected);
		};

		const onConnection = ( socket, pxSocket ) =>
		{
			expect (pxSocket.isAuthed).to.be.false;

			pxSocket.on ('data', data =>
			{
				numAuthAttempts++;

				if ( numAuthAttempts >= maxAuthAttempts )
				{
					pxObject.destroyServer ();
					tcpSocket.end ();

					done ();
				}
				else if ( numAuthAttempts === 1 )
				{
					expect (pxSocket.isAuthed).to.be.false;
				}
				else if ( numAuthAttempts === 2 )
				{
					expect (pxSocket.isAuthed).to.be.true;
				}
				else if ( numAuthAttempts === 3 )
				{
					expect (pxSocket.isAuthed).to.be.false;
				}
			});
		};

		pxObject.createServer ({ onStart, onConnection });
	});

	it (`should set isAdmin to true when socket is admin and vice versa for not admin`, function ( done )
	{
		const tcpSocket = new Socket ();

		let numAdminAttempts = 0;
		let maxAdminAttempts = 3;

		const onStart = () =>
		{
			const onSocketConnected = () =>
			{
				const command = pxObject.getCommandCode ('CL_AUTH_INFO');
				const name    = 'App';
				const version = 1;
				const login   = 'l';
				const admin   = 'a';

				tcpSocket.write (`${command}\r\n`);

				setTimeout (() =>
				{
					tcpSocket.write (`${[command, name, version, PXSYS_VERSION, login, admin].join ('\t')}\r\n`);
				}, 20);

				setTimeout (() =>
				{
					tcpSocket.write (`${[command, name, version, Math.random (), login, Math.random ()].join ('\t')}\r\n`);
				}, 40);
			};

			tcpSocket.connect (pxObject._server.port, pxObject._server.address, onSocketConnected);
		};

		const onConnection = ( socket, pxSocket ) =>
		{
			expect (pxSocket.isAdmin).to.be.false;

			pxSocket.on ('data', data =>
			{
				numAdminAttempts++;

				if ( numAdminAttempts >= maxAdminAttempts )
				{
					pxObject.destroyServer ();
					tcpSocket.end ();

					done ();
				}
				else if ( numAdminAttempts === 1 )
				{
					expect (pxSocket.isAdmin).to.be.false;
				}
				else if ( numAdminAttempts === 2 )
				{
					expect (pxSocket.isAdmin).to.be.true;
				}
				else if ( numAdminAttempts === 3 )
				{
					expect (pxSocket.isAdmin).to.be.false;
				}
			});
		};

		pxObject.createServer ({ onStart, onConnection });
	});
});
